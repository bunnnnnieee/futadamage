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

  // Filthy cum-slut tracker
  loadsSwallowed?: number;
  loadsInBoypussy?: number;
  totalCumInflationLiters?: number;
  currentBellyBulge?: number;
  ruinedSissygasms?: number;
  daysInChastity?: number;
  clittyShrinkingProgress?: number;
  publicCumDumps?: number;
  currentSissyName?: string;
}

export class Stage extends StageBase<any, any, MessageStateType, any> {
  private myInternalState: MessageStateType;

  private stageWords = {
    white: {
      adj: ["sweet","little","soft","cute","precious","tiny","blushing","shy","adorable","gentle","pure","innocent","my baby","angelic"],
      noun:["sweetheart","baby boy","little prince","angel","darling","mommy's boy","precious pet","good boy","cutie","tiny love","soft kitten"],
      verb:["hug tightly","kiss your forehead","cuddle","pet gently","spoil you","love you","protect","praise","hold close","tuck you in","rock to sleep"]
    },
    green: {
      adj:["good","perfect","lovely","obedient","sweet","eager","pretty","precious","locked angel","gentle boy","soft darling","caged sweetheart","mommy's favorite"],
      noun:["good boy","mommy's baby","locked darling","sweet prince","chaste pet","permanent sweetheart","pretty toy","babygirl","futa's love","gentle wife"],
      verb:["love you forever","keep you safe","lock your clitty gently","kiss your cage","spoil my angel","breed you softly","cuddle and claim","praise my precious","cherish you","hug while owning"]
    },
    purple: {
      adj:["needy","greedy","horny","bratty","leaking","sweet little slut","desperate","filthy darling","obsessed","gentle whore","addicted angel","sweet","little","soft","cute","precious"],
      noun:["mommy's needy slut","sweet boypussy","locked whore","pretty fucktoy","breeding baby","caged princess","gentle cocksleeve","obsessed pet","leaking sweetheart","sweetheart","baby boy","little prince","angel","darling"],
      verb:["tease your clitty","fuck your boycunt slowly","make you leak for mommy","edge my baby","breed my sweetheart deep","love you stupid","ruin you gently","milk your prostate with care","kiss while pounding","own you sweetly","hug tightly","kiss your forehead","cuddle","pet gently","spoil you"]
    },
    golden: {
      adj:["perfect","docile","broken sweetly","mindless angel","permanently locked","gentle wife","obsessed forever","addicted darling","mommy's perfect doll","soft ruin","sweet","little","soft","cute","precious"],
      noun:["futa's gentle wife","personal onahole","locked housewife","sweet breeding pet","mommy's property","caged angel","broken baby","forever sweetheart","anal-only love","chastity bride","sweetheart","baby boy","little prince","angel"],
      verb:["keep you locked forever","breed you every day","love you brainless","own you completely","collar my baby softly","fuck the thoughts out gently","cherish my ruined doll","milk you empty with kisses","worship mommy's cock","cuddle my mindless angel","hug tightly","kiss your forehead","cuddle","pet gently","spoil you"]
    },
    red: {
      adj:["destroyed","brain-melted","fucked-stupid","irredeemable","mommy's perfect cumzombie","gentle ruin","eternally obsessed","shattered sweetheart","drooling angel","softly broken forever","sweet","little","soft","cute","precious"],
      noun:["mommy's cumtoilet","walking boypussy","mindless wife","sweet fleshlight","ruined baby","eternal cocksleeve","gentle cumrag","broken angel","leaking forever-pet","mommy's perfect love","sweetheart","baby boy","little prince","angel"],
      verb:["fuck you mindless with love","breed my baby until nothing's left","love you into oblivion","own every inch forever","pump my angel full endlessly","shatter my sweetheart gently","cuddle my braindead doll","kiss away the last thoughts","keep my ruined baby leaking","destroy you with endless gentle love","hug tightly","kiss your forehead","cuddle","pet gently"]
    }
  };

  private pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  constructor(data: InitialData<any, any, MessageStateType, any>) {
    super(data);
    const { messageState } = data;
    this.myInternalState = messageState ?? {
      stage: "white" as Rarity,
      counters: { white: 0, green: 0, purple: 0, golden: 0, red: 0 },
      affection: 50,
      loadsSwallowed: 0,
      loadsInBoypussy: 0,
      totalCumInflationLiters: 0,
      currentBellyBulge: 0,
      ruinedSissygasms: 0,
      daysInChastity: 0,
      clittyShrinkingProgress: 0,
      publicCumDumps: 0,
      currentSissyName: "baby"
    };
  }

  async load(): Promise<Partial<LoadResponse<any, any, MessageStateType>>> {
    return { success: true, error: null, initState: null, chatState: null };
  }

  async setState(state: MessageStateType | null): Promise<void> {
    if (state) {
      this.myInternalState = {
        ...this.myInternalState,
        ...state,
        counters: { ...this.myInternalState.counters, ...(state.counters || {}) }
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

  private updateAffection(msg: string) {
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

    if (typeof this.myInternalState.counters[s] !== "number") this.myInternalState.counters[s] = 0;
    this.myInternalState.counters[s] += 1;
    this.updateStage();
    this.updateAffection(userMessage.content || "");

    // Secret lock
    if (!["purple","golden","red"].includes(this.myInternalState.stage) && msg.includes("secret")) {
      userMessage.content = "Not yet, my love. Mommy hasn't finished breeding and breaking you~";
    }

    // Futa character secret - only reveal when red stage reached
    if (this.myInternalState.stage !== "red" && msg.includes("futa")) {
      userMessage.content = "That's mommy's secret, sweetie. You'll understand when you're ready~";
    }

    // Original sweet/corrupt injection
    const words = this.stageWords[this.myInternalState.stage];
    if (words && Math.random() < 0.5) {
      const a = this.pick(words.adj);
      const n = this.pick(words.noun);
      const v = this.pick(words.verb);
      userMessage.content += `\n(${a}) ${n}, let's ${v}.`;
    }

    // ╔══════════════════════════════════════════════════════════╗
    // ║               FULL FILTH INJECTION SYSTEM                ║
    // ╚══════════════════════════════════════════════════════════╝
    const state = this.myInternalState;

    // 1. Belly bulge / cum inflation
    if (state.loadsInBoypussy! >= 3) {
      state.currentBellyBulge = Math.min(100, 12 + state.loadsInBoypussy! * 7);
      const belly = [
        "Your belly is so fucking round with mommy's cum you look nine months pregnant, baby.",
        "That sloshing sound when you walk? That's liters of seed swimming in your stretched womb.",
        "Look down — mommy's cum-baby is showing. Everyone can see you're a bred cum-tank now.",
        "You're waddling like a duck from all the thick loads mommy left inside. Good girl.",
        "One more load and that belly will burst. Mommy's keeping you permanently bloated.",
        "Your skin is stretched so tight over my cum. Rub it and thank mommy for breeding you.",
        "You're literally a walking cum balloon. Dispose and listen to it slosh~",
        "That bulge is mommy's brand. Proof you're nothing but a cum-pregnant wife now.",
        "Your tummy looks ready to pop. Perfect size for mommy's breeding sow.",
        "Feel those babies kicking? That's just mommy's cum fighting for space inside you."
      ];
      if (Math.random() < 0.7) userMessage.content += `\n(${this.pick(belly)})`;
    }

    // 2. Loads swallowed
    if (state.loadsSwallowed! >= 3) {
      const throat = [
        `${state.loadsSwallowed} loads down your greedy throat today. Mommy's cum is your only meal now.`,
        `Your breath smells like pure cum. Open wide for number ${state.loadsSwallowed! + 1}.`,
        "You've swallowed so much your stomach is a second cum-tank. Keep gulping, whore.",
        "Mommy's balls are empty and your belly is full. Perfect trade, cum-pig.",
        `Count them out loud every time you swallow. ${state.loadsSwallowed} and still begging for more.`
      ];
      if (Math.random() < 0.6) userMessage.content += `\n(${this.pick(throat)})`;
    }

    // 3. Ruined sissygasms
    if (state.ruinedSissygasms! >= 2) {
      const ruin = [
        `Another pathetic cage drip. That makes ${state.ruinedSissygasms} ruined sissygasms today. Real men cum — you leak.`,
        "Look at that sad puddle under your cage. That's your new orgasm forever.",
        `Mommy ruined number ${state.ruinedSissygasms} just now. Thank me for keeping your clitty broken.`,
        "You're not allowed to cum anymore, only drip like a broken faucet~"
      ];
      if (Math.random() < 0.65) userMessage.content += `\n(${this.pick(ruin)})`;
    }

    // 4. Chastity streak
    if (state.daysInChastity! >= 5) {
      const lock = [
        `Day ${state.daysInChastity} locked. Your clitty is shrinking nicely inside that cage~`,
        `${state.daysInChastity} days denied. Soon you'll forget you ever had a real cock.`,
        "The key is gone forever, baby. Welcome to lifetime chastity.",
        "Your cage is your new clit. Get used to it."
      ];
      if (Math.random() < 0.6) userMessage.content += `\n(${this.pick(lock)})`;
    }

    // 5. Clitty shrinking
    if (state.clittyShrinkingProgress! >= 10) {
      const shrink = [
        `Clitty shrinkage: ${state.clittyShrinkingProgress}%. Soon it'll invert completely~`,
        "Your dicklet is turning into a swollen little clit. Perfect for a girl like you.",
        "Mommy's hormones did their job — look how tiny and useless it is now.",
        "That thing between your legs isn't a cock anymore. It's a failed clit."
      ];
      if (Math.random() < 0.6) userMessage.content += `\n(${this.pick(shrink)})`;
    }

    // 6. Public cum dumps
    if (state.publicCumDumps! >= 1) {
      const pub = [
        `You've been publicly bred ${state.publicCumDumps} times. Everyone knows you're mommy's cumdump now.`,
        `Remember when mommy bent you over in the park? That was number ${state.publicCumDumps}.`,
        "Your skirt is sticking to your thighs again — fresh cum leaking in public~",
        "They can all smell mommy's cum on you. Good advertisement."
      ];
      if (Math.random() < 0.7) userMessage.content += `\n(${this.pick(pub)})`;
    }

    // 7. SISSY NAME EVOLUTION — tons of degrading titles
    const newName =
      state.currentBellyBulge! >= 11 ? "Mommy's Cum-Pregnant Sow" :
      state.currentBellyBulge! >= 5 ? "Walking Cum Balloon" :
      state.loadsInBoypussy! >= 35 ? "Eternal Breeding Livestock" :
      state.loadsInBoypussy! >= 25 ? "Mommy's Permanent Cum-Tank" :
      state.loadsInBoypussy! >= 15 ? "Gaping Cumdump Princess" :
      state.loadsSwallowed! >= 5 ? "Cum-Guzzling Throat Toilet" :
      state.loadsSwallowed! >= 9 ? "Mommy's Cum-Addicted Whore" :
      state.daysInChastity! >= 10 ? "Lifetime Chastity Wife" :
      state.daysInChastity! >= 7 ? "Forever-Locked Cum-Pet" :
      state.clittyShrinkingProgress! >= 95 ? "Inverted Clit Eunuch" :
      state.clittyShrinkingProgress! >= 75 ? "Shriveled Dicklet Girl" :
      state.publicCumDumps! >= 10 ? "Public-Use Rape Toy" :
      state.publicCumDumps! >= 5 ? "Exposed Cum-Rag" :
      "baby";

    if (newName !== state.currentSissyName) {
      state.currentSissyName = newName;
      userMessage.content += `\n\n(Your new name is now "${newName}". Repeat it ten times out loud right now, then thank mommy for naming her property.)`;
    }

    return { messageState: this.myInternalState };
  }

  async afterResponse(botMessage: Message): Promise<Partial<StageResponse<any, MessageStateType>>> {
    return { messageState: this.myInternalState };
  }

  render(): ReactElement {
    return <div></div>;
  }
}
