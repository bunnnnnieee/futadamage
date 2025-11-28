import { ReactElement } from "react";
import { StageBase, StageResponse, InitialData, Message } from "@chub-ai/stages-ts";
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
      adj:["challenging","bold","teasing","horny","lewd","needy","greedy","flirty","seductive","playful","mischievous","cocky","thirsty","desperate","frisky","touchy"],
      noun:["princess","tester","brat","toy","pet","minx","tease","troublemaker","doll","kitten","bunny","vixen","good girl","bad girl","prey","prettypet"],
      verb:["tease","challenge","spank","grope","edge","deny","dress up","mock","torture","explore","ruin","break","corrupt","train","stretch","mark","own","claim","use"]
    },
    golden: {
      adj:["obedient","perfect","broken","addicted","owned","trained","docile","submissive","devoted","loyal","worshipping","desperate","needy","pathetic","helpless","dependent","adoring","grateful"],
      noun:["good subject","property","partner","slave","pet","bimbo","doll","toy","angel","babygirl","kitten","puppy","favorite project","locked subject"],
      verb:["cage","lock","train","break","brainwash","feminize","ruin","own","collar","leash","worship","serve","obey","beg","thank","leak","drip","moan","scream"]
    },
    red: {
      adj:["worthless","pathetic","drooling","brain-broken","ruined","destroyed","mindless","leaking","swollen","feral","obsessed","addicted","desperate","irredeemable","twisted","insane","unhinged"],
      noun:["master's tool","subject","forever slave","brainless doll","pet","broken subject","devotee","property","favorite project","cum-zombie","eternal pet"],
      verb:["destroy","subdue","break forever","brain-melt","claim","mark permanently","degrade","humiliate","expose","parade","mind-break","shatter","own eternally","corrupt completely","keep forever"]
    }
  };

  private pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  constructor(data: InitialData<any, any, MessageStateType, any>) {
    super(data);
    this.myInternalState = data.messageState ?? {
      stage: "white",
      counters:{white:0,green:0,purple:0,golden:0,red:0},
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

  // 🔥 THIS IS THE MISSING FUNCTION — FIXED
  async onLoad(): Promise<Partial<LoadResponse<any, any, MessageStateType, any>>> {
    return {
      success:true,
      messageState:this.myInternalState
    };
  }

  private updateStage(): void {
    const t = this.myInternalState.counters;
    const total = t.white+t.green+t.purple+t.golden+t.red;
         if(total >=1000) this.myInternalState.stage = "red";
    else if(total >= 65) this.myInternalState.stage = "golden";
    else if(total >= 45) this.myInternalState.stage = "purple";
    else if(total >= 25) this.myInternalState.stage = "green";
    else this.myInternalState.stage = "white";
  }

  private updateAffection(msg: string){
    const m = msg.toLowerCase();
    const nice=["cute","beautiful","sweet","good","great"];
    const flirt=["hot","sexy","tease","playful"];
    const rude=["stupid","idiot","bad","fail"];
    let p=0;
    nice.some(w=>m.includes(w))&&(p+=3);
    flirt.some(w=>m.includes(w))&&(p+=5);
    rude.some(w=>m.includes(w))&&(p-=4);
    this.myInternalState.affection = Math.max(0,Math.min(100,this.myInternalState.affection+p));
  }

  async beforePrompt(userMessage: Message): Promise<Partial<StageResponse<any, MessageStateType>>> {
    const msg = userMessage.content.toLowerCase();

    const s = this.myInternalState.stage;
    this.myInternalState.counters[s]++;
    this.updateStage();
    this.updateAffection(userMessage.content);

    if(!["purple","golden","red"].includes(this.myInternalState.stage) && msg.includes("secret")){
      userMessage.content = "We are not far enough yet. Work harder for me first.";
    }

    const words = this.stageWords[this.myInternalState.stage];
    if(Math.random()<0.5){
      userMessage.content += `\n(${this.pick(words.adj)}) ${this.pick(words.noun)}, let's ${this.pick(words.verb)}.`;
    }

    return { messageState:this.myInternalState };
  }

  async afterResponse(): Promise<Partial<StageResponse<any, MessageStateType>>> {
    return { messageState:this.myInternalState };
  }

  render(): ReactElement {
    return <div></div>;
  }
}
