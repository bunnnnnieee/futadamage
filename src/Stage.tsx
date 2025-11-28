// stages/stage.tsx
import { ReactElement } from "react";
import { StageBase, StageResponse, InitialData, Message } from "@chub-ai/stages-ts";
import { LoadResponse } from "@chub-ai/stages-ts/dist/types/load";

type Rarity = "white" | "green" | "purple" | "golden" | "red";

interface StageState {
  stage: Rarity;
  counters: Record<Rarity, number>;
  affection: number;
  numUsers?: number;
  numChars?: number;
}

export class Stage extends StageBase<any, any, StageState, any> {
  private myInternalState: StageState;

  // ─────────────── STAGE WORDS ───────────────
  private stageWords: Record<Rarity, { adjectives: string[]; nouns: string[]; verbs: string[] }> = {
    white: {
      adjectives: ["cute","soft","adorable","precious","sweet","tiny","innocent","shy","blushing","lovable","huggable","warm","cozy","gentle","pure"],
      nouns: ["baby","cutie","little one","bunny","kitten","angel","darling","sweetie","princess","pumpkin","bean","cupcake","marshmallow","snugglebug","lovebug"],
      verbs: ["cuddle","hug","kiss","pet","hold","snuggle","nuzzle","boop","squish","protect","spoil","carry","rock","tuck in","praise"]
    },
    green: {
      adjectives: ["good","perfect","precious","amazing","brave","smart","talented","handsome","strong","lovely","obedient","polite","gentle","caring","thoughtful","mature","responsible"],
      nouns: ["good boy","little bro","prince","treasure","angel","hero","champ","sunshine","star","king","my love","sweetheart","baby boy","puppy","knight","protector","big boy","honey"],
      verbs: ["praise","reward","protect","guide","teach","spoil","comfort","heal","carry","shield","cherish","worship","support","encourage","love","hug tightly","kiss forehead","headpat"]
    },
    purple: {
      adjectives: ["naughty","slutty","bratty","teasing","horny","lewd","needy","greedy","perverted","flirty","seductive","playful","mischievous","cock-hungry","thirsty","desperate","frisky","touchy","grabby","spoiled","cocky","bold"],
      nouns: ["princess","sissy","brat","toy","pet","bitch","slut","minx","tease","troublemaker","cockslut","cumdump","fucktoy","doll","kitten","bunny","vixen","whore","good girl","bad girl","prey","prettypet"],
      verbs: ["tease","bully","spank","grope","grind on","edge","deny","dress up","humiliate","mock","torture","rail","ruin","break","corrupt","train","stretch","breed","mark","own","claim","use"]
    },
    golden: {
      adjectives: ["obedient","perfect","broken","addicted","owned","trained","brainless","caged","feminized","ruined","docile","submissive","devoted","loyal","worshipping","desperate","needy","pathetic","helpless","dependent","adoring","grateful","thankful","blissful","empty-headed"],
      nouns: ["good girl","fuckdoll","slave","property","wife","pet","bimbo","sissy","cocksleeve","breeding toy","Mommy’s girl","cumdump","whore","princess","doll","toy","angel","babygirl","kitten","puppy","cow","milked pet","locked slut","chastity pet","Mommy’s favorite"],
      verbs: ["cage","lock","breed","milk","train","break","brainwash","feminize","impregnate","pump full","feed pills","stretch","ruin","own","collar","leash","worship","serve","obey","beg","thank","leak","drip","moan","scream"]
    },
    red: {
      adjectives: ["worthless","pathetic","drooling","cum-drunk","brain-broken","ruined","destroyed","mindless","leaking","bloated","swollen","feral","obsessed","addicted","desperate","filthy","disgusting","depraved","perverted","twisted","insane","unhinged","rabid","possessed","cum-addicted","breeding-obsessed","cock-worshipping","sissy-broken","feminized forever","irredeemable"],
      nouns: ["cum-dump","cocksleeve","breeding sow","sissy bitch","fuckpet","cum-toilet","meat hole","rape toy","public whore","walking womb","cum balloon","brainless slut","drooling mess","cum-rag","semen tank","breeding stock","futa’s wife","personal onahole","cum-bucket","sissy livestock","broken doll","cum-zombie","futa’s property","eternal cum-slut","leaking wife","public cum-rag","cock-worshipper","breeding slave","futa’s cum-vessel","ruined sissy"],
      verbs: ["destroy","impregnate","pump full","flood","break forever","brain-melt","rape","breed raw","fill to bursting","mark permanently","tattoo","collar","chain","degrade","humiliate","expose","parade","leak in public","force-feed cum","mind-break","shatter","own eternally","corrupt completely","turn into cum-zombie","keep forever","never release","mate-press","belly-bulge","womb-tattoo","ruin completely"]
    }
  };

  constructor(data: InitialData<any, any, StageState, any>) {
    super(data);
    const { users, characters, messageState } = data;
    this.myInternalState = messageState ?? {
      stage: "white",
      counters: { white: 0, green: 0, purple: 0, golden: 0, red: 0 },
      affection: 50,
      numUsers: Object.keys(users).length,
      numChars: Object.keys(characters).length
    };
  }

  async load(): Promise<Partial<LoadResponse<any, any, StageState>>> {
    return { success: true };
  }

  private pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  private updateStageFromCounters() {
    const total =
      this.myInternalState.counters.white +
      this.myInternalState.counters.green +
      this.myInternalState.counters.purple +
      this.myInternalState.counters.golden +
      this.myInternalState.counters.red;

    if (total >= 1000) this.myInternalState.stage = "red";
    else if (total >= 65) this.myInternalState.stage = "golden";
    else if (total >= 45) this.myInternalState.stage = "purple";
    else if (total >= 25) this.myInternalState.stage = "green";
    else this.myInternalState.stage = "white";
  }

  private updateAffection(content: string) {
    const lower = content.toLowerCase();
    const compliments = ["cute","pretty","beautiful"];
    const flirts = ["sexy","hot"];
    const rude = ["stupid","bitch"];

    let points = 0;
    compliments.some(w => lower.includes(w)) && (points += 3);
    flirts.some(w => lower.includes(w)) && (points += 5);
    rude.some(w => lower.includes(w)) && (points -= 4);

    this.myInternalState.affection = Math.max(0, Math.min(100, this.myInternalState.affection + points));
  }

  async beforePrompt(userMessage: Message): Promise<Partial<StageResponse<any, StageState>>> {
    const msg = userMessage.content;

    // Increment current stage counter
    const currentStage = this.myInternalState.stage;
    this.myInternalState.counters[currentStage] += 1;

    // Update stage
    this.updateStageFromCounters();

    // Update affection
    this.updateAffection(msg);

    // Secret lock until purple
    if (!["purple","golden","red"].includes(this.myInternalState.stage) && msg.toLowerCase().includes("secret")) {
      userMessage.content = "I can't tell you that yet.";
    }

    // Inject random stage-flavored line
    const words = this.stageWords[this.myInternalState.stage];
    if (Math.random() < 0.6) {
      const line = `${this.pick(words.adjectives)} ${this.pick(words.nouns)}, I just want to ${this.pick(words.verbs)} you right now~`;
      userMessage.content += `\n${line}`;
    }

    return { messageState: this.myInternalState };
  }

  async afterResponse(botMessage: Message): Promise<Partial<StageResponse<any, StageState>>> {
    return { messageState: this.myInternalState };
  }

  render(): ReactElement {
    return <div></div>;
  }
}