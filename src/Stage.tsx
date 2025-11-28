// stages/stage.tsx
import { ReactElement } from "react";
import {
  StageBase,
  StageResponse,
  InitialData,
  Message,
} from "@chub-ai/stages-ts";
import { LoadResponse } from "@chub-ai/stages-ts/dist/types/load";

type Rarity = "white" | "green" | "purple" | "golden" | "red";

interface MessageStateType {
  stage: Rarity;
  counters: Record<Rarity, number>;
  affection: number;
  tasksCompleted?: number;
  daysOfFocus?: number;
  projectCompletion?: number;
  publicEventCount?: number;
  reportsGenerated?: number;
  commitmentDate?: number | null;
  enthusiasmLevel?: number;
  hoursSinceLastMilestone?: number;
}

export class Stage extends StageBase<any, any, MessageStateType, any> {
  private myInternalState: MessageStateType;

  private stageWords = {
    white: {
      adj: ["cute","soft","adorable","sweet","tiny","innocent","shy","fresh","lovable","new","cozy","gentle","pure"],
      noun:["starter","novice","little one","bud","kitten","angel","darling","project","beginner","marshmallow","snugglebug"],
      verb:["learn","study","kiss","pet","hold","snuggle","boop","squish","protect","spoil","carry","rock","guide","praise"]
    },
    green: {
      adj:["good","perfect","focused","amazing","brave","smart","talented","capable","strong","lovely","obedient","polite","caring","thoughtful","mature","responsible"],
      noun:["good trainee","team member","partner","treasure","star student","hero","champ","sunshine","king","my love","sweetheart","baby boy","puppy","knight","protector","big boy"],
      verb:["praise","reward","protect","guide","teach","spoil","comfort","heal","carry","shield","cherish","support","encourage","love","hug tightly","headpat"]
    },
    purple: {
      adj:["challenging","bold","teasing","playful","needy","greedy","flirty","seductive","mischievous","cocky","thirsty","desperate","frisky","touchy"],
      noun:["princess","tester","brat","toy","pet","minx","tease","troublemaker","doll","kitten","bunny","vixen","good girl","bad girl","prey","prettypet"],
      verb:["tease","challenge","spank","edge","deny","dress up","mock","explore","train","mark","own","claim","use"]
    },
    golden: {
      adj:["obedient","perfect","trained","docile","submissive","devoted","loyal","grateful"],
      noun:["good subject","property","partner","pet","doll","toy","angel","favorite project","locked subject"],
      verb:["cage","lock","train","break","own","collar","leash","worship","serve","obey","beg","thank"]
    },
    red: {
      adj:["worthless","pathetic","ruined","destroyed","mindless","swollen","obsessed","addicted","desperate","irredeemable"],
      noun:["master's tool","subject","forever slave","brainless doll","pet","broken subject","devotee","property"],
      verb:["destroy","subdue","break forever","claim","mark permanently","degrade","humiliate","expose","parade","shatter","own eternally"]
    }
  };

  private pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  constructor(data: InitialData<any, any, MessageStateType, any>) {
    super(data);
    const { messageState } = data;
    this.myInternalState = messageState ?? {
      stage: "white",
      counters:{ white:0, green:0, purple:0, golden:0, red:0 },
      affection:50,
      tasksCompleted:0,
      daysOfFocus:0,
      projectCompletion:0,
      publicEventCount:0,
      reportsGenerated:0,
      commitmentDate:null,
      enthusiasmLevel:0,
      hoursSinceLastMilestone:0
    };
  }

  /**
   * Required v1 lifecycle: load()
   * - Must return a Partial<LoadResponse<InitState, ChatState, MessageState>>
   */
  async load(): Promise<Partial<LoadResponse<any, any, MessageStateType>>> {
    return {
      success: true,
      error: null,
      initState: null,
      chatState: null,
    };
  }

  /**
   * Required setter for restoring state from the host
   */
  async setState(state: MessageStateType | null): Promise<void> {
    if (state) {
      // shallow merge; keep counters if provided
      this.myInternalState = {
        ...this.myInternalState,
        ...state,
        counters: {
          ...this.myInternalState.counters,
          ...(state.counters || {})
        }
      };
    }
  }

  private updateStage(): void {
    const t = this.myInternalState.counters;
    const total = t.white + t.green + t.purple + t.golden + t.red;
    if (total >= 1000) this.myInternalState.stage = "red";
    else if (total >= 65) this.myInternalState.stage = "golden";
    else if (total >= 45) this.myInternalState.stage = "purple";
    else if (total >= 25) this.myInternalState.stage = "green";
    else this.myInternalState.stage = "white";
  }

  private updateAffection(msg: string){
    const m = (msg || "").toLowerCase();
    const nice = ["cute","beautiful","sweet","good","great"];
    const flirt = ["hot","sexy","tease","playful"];
    const rude = ["stupid","idiot","bad","fail"];
    let p = 0;
    nice.some(w => m.includes(w)) && (p += 3);
    flirt.some(w => m.includes(w)) && (p += 5);
    rude.some(w => m.includes(w)) && (p -= 4);
    this.myInternalState.affection = Math.max(0, Math.min(100, this.myInternalState.affection + p));
  }

  async beforePrompt(userMessage: Message): Promise<Partial<StageResponse<any, MessageStateType>>> {
    const msg = (userMessage.content || "").toLowerCase();

    const s = this.myInternalState.stage;
    // ensure counter exists
    if (typeof this.myInternalState.counters[s] !== "number") this.myInternalState.counters[s] = 0;
    this.myInternalState.counters[s] += 1;

    this.updateStage();
    this.updateAffection(userMessage.content || "");

    // Secret lock until purple
    if (!["purple","golden","red"].includes(this.myInternalState.stage) && msg.includes("secret")) {
      // v1 preferred behavior: do not rely on modifiedMessage — store a flag in state
      // but small replacement is still commonly used; if you have issues, remove this mutation.
      userMessage.content = "We are not far enough yet. Work harder for me first.";
    }

    // Random stage-flavored line injection (be careful: mutating userMessage may not always be used by host)
    const words = this.stageWords[this.myInternalState.stage];
    if (words && Math.random() < 0.5) {
      const a = this.pick(words.adj);
      const n = this.pick(words.noun);
      const v = this.pick(words.verb);
      userMessage.content += `\n(${a}) ${n}, let's ${v}.`;
    }

    return { messageState: this.myInternalState };
  }

  // afterResponse must accept the Message param or TS will complain about abstract implementation
  async afterResponse(botMessage: Message): Promise<Partial<StageResponse<any, MessageStateType>>> {
    // you can append debug info here if you want, but keep returns minimal
    return { messageState: this.myInternalState };
  }

  render(): ReactElement {
    return <div></div>;
  }
}