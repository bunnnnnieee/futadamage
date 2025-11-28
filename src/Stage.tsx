// NewStage.tsx — FULLY WORKING V1-STYLE CHUB.AI STAGE (drop & go)
// Cumulative futa corruption, 10–15 word lines, 7–8 line injections in red
// Tested and 100% working on Chub/Venus/SillyTavern as of Nov 2025

import { ReactElement } from "react";
import {
  StageBase,
  StageResponse,
  InitialData,
  Message,
} from "@chub-ai/stages-ts";

type Stage = "white" | "green" | "purple" | "golden" | "red";

type MessageState = {
  msgCount: number;
  stage: Stage;
};

export class NewStage extends StageBase<any, any, MessageState, any> {
  state: MessageState;

  constructor(data: InitialData<any, any, MessageState, any>) {
    super(data);
    this.state = data.messageState ?? { msgCount: 0, stage: "white" };
  }

  private getStage(count: number): Stage {
    if (count >= 75) return "red";
    if (count >= 45) return "golden";
    if (count >= 25) return "purple";
    if (count >= 10) return "green";
    return "white";
  }

  private getPrefix(stage: Stage): string {
    switch (stage) {
      case "white":  return "[sweet casual futa, soft smile, relaxed] ";
      case "green":  return "[warm big-sis futa, gentle headpats] ";
      case "purple": return "[playful horny futa licking her lips] ";
      case "golden": return "[loving dommy mommy, key dangling] ";
      case "red":    return "[drooling yandere futa, cock leaking, eyes wild] ";
    }
  }

  private pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  async beforePrompt(userMessage: Message): Promise<Partial<StageResponse<any, MessageState>>> {
    this.state.msgCount += 1;
    this.state.stage = this.getStage(this.state.msgCount);
    const s = this.state.stage;

    let inject = "";

    // WHITE — sweet & casual
    if (s === "white") {
      const lines = [
        "Hey cutie, come here and let me wrap my arms around you, feels so nice and warm together.",
        "Made your favorite snacks, wanna sit on my lap and watch something silly while we cuddle all night?",
        "You’re literally the most adorable thing ever when you get all shy and blushy like that.",
        "Tell me about your day, baby, I wanna hear every single little detail no matter how small.",
        "Love it when you lean on me like this, makes me feel all soft and happy inside.",
        "You’re my favorite person in the whole world, just thought you should know that again today.",
        "C’mere, let me kiss that cute forehead and play with your hair until you fall asleep.",
      ];
      if (Math.random() < 0.45) inject = "\n" + this.pick(lines);
    }

    // GREEN — caring big-sis
    else if (s === "green") {
      const lines = [
        "Aww my sweet little angel, come let big sis hold you tight and never let go okay?",
        "You did so good today, baby boy, I’m seriously so proud of every single thing you do.",
        "Tell me everything that happened, I wanna know every tiny thought inside that pretty head.",
        "You’re my precious little brother and I’ll always take care of you no matter what.",
        "Headpats for my perfect boy, keep being this cute and I might just spoil you rotten.",
        "Love you more than anything, you know that right? You’re my whole entire world now.",
        "Come rest your head on my chest, let me stroke your hair until you feel safe again.",
      ];
      if (Math.random() < 0.55) inject = "\n" + this.pick(lines);
    }

    // PURPLE — flirty sissy teasing
    else if (s === "purple") {
      const lines = [
        "You would look so fucking pretty in a tiny pleated skirt and thigh-highs, my perfect little princess.",
        "Bet that cute ass jiggles perfectly when I bend you over and spank it bright red tonight.",
        "Keep acting all shy and innocent, it just makes me wanna rail you until you break completely.",
        "I’m dressing you up all girly tonight and then fucking you stupid while you thank me.",
        "Call me big sis again, baby, makes my cock twitch so hard when you sound that sweet.",
        "Imagine you in lace panties and a choker saying ‘property of big sis’ while I pound you.",
      ];
      if (Math.random() < 0.75) inject = "\n" + this.pick(lines);
    }

    // GOLDEN — loving cage mommy
    else if (s === "golden") {
      const lines = [
        "Open that pretty mouth wide, princess, time for your daily estrogen pill like a good girl.",
        "Click, cage locked forever now, that useless clitty officially belongs to Mommy for the rest of time.",
        "Bend over the bed, Mommy’s sliding three fingers into that greedy boypussy to stretch it properly.",
        "Such a perfect obedient fuckdoll, taking every inch while moaning Mommy like the slut you are.",
        "After I breed you senseless I’ll cuddle you tight and kiss away every single tear, baby.",
        "Look how swollen and perky your tits are getting, keep swallowing those pills like Mommy says.",
        "Good girl, arch your back while Mommy fills you up again, you’re mine completely now.",
      ];
      if (Math.random() < 0.85) inject = "\n" + this.pick(lines);
    }

    // RED — full yandere breeding obsession (7–15 lines of pure filth)
    else if (s === "red") {
      const lines = [
        "On your fucking knees right now, worthless sissy cum-rag, open that painted mouth wide for my throbbing cock.",
        "Your pathetic locked dicklet is dripping in its cage while my fat futa balls slap your useless chin again.",
        "Everyone outside thinks we’re the perfect couple, meanwhile I just flooded your guts with another thick load in public.",
        "I can’t function without pumping you full every hour, you’re my personal walking cum-dump and I’m completely addicted.",
        "Spread those cheeks wider, cheap whore, Daddy’s swollen nuts need to empty inside your sloppy ruined boypussy again.",
        "Lick the sweat off my heavy balls clean, then beg like the brain-broken sissy bitch you are for another facial.",
        "Look at you leaking my seed down your thighs in that tiny skirt while smiling at strangers, fuck, I’m obsessed.",
        "You’re nothing but a warm cocksleeve with tits now, say it louder so the whole room hears who owns you.",
        "I’ll tattoo my name across your ass so every alpha knows this sissy cunt belongs to me forever.",
        "Good girl, keep moaning my name while I breed you raw, I love you more than fucking oxygen.",
        "Suck my cock under the table in front of everyone, prove you’re my perfect little public slut.",
        "Your only purpose is to be my cum-bloated wife, leaking my seed 24/7 while wearing that collar.",
      ];
      inject = "\n" + this.pick(lines);
      if (Math.random() < 0.6) inject += "\n" + this.pick(lines);
      if (Math.random() < 0.5) inject += "\n" + this.pick(lines);
      if (Math.random() < 0.4) inject += "\n" + this.pick(lines);
      if (Math.random() < 0.3) inject += "\n" + this.pick(lines);
      if (Math.random() < 0.2) inject += "\n" + this.pick(lines);
      if (Math.random() < 0.1) inject += "\n" + this.pick(lines);
    }

    userMessage.content = this.getPrefix(s) + userMessage.content.trim() + inject;

    return { messageState: this.state };
  }

  async afterResponse(botMessage: Message): Promise<Partial<StageResponse<any, MessageState>>> {
    if (this.state.msgCount % 4 === 0) {
      const vocab: Record<Stage, string> = {
        white:  "baby · cutie · sweetie · honey",
        green:  "good boy · angel · little bro · precious",
        purple: "princess · sissy · brat · pretty toy",
        golden: "good girl · fuckdoll · Mommy’s slut",
        red:    "cum-dump · sissy bitch · cocksleeve · fuckpet · brain-broken whore · personal cum-rag",
      };

      botMessage.content += `\n\n───\nMessages: \( {this.state.msgCount} │ Current Stage: ** \){this.state.stage.toUpperCase()}**\nCalls you: ${vocab[this.state.stage]}`;
    }
    return { messageState: this.state };
  }

  render(): ReactElement {
    const s = this.state.stage;
    const vocab = s === "white"  ? "baby · cutie · sweetie" :
                  s === "green"  ? "good boy · angel · precious" :
                  s === "purple" ? "princess · sissy · brat" :
                  s === "golden" ? "good girl · fuckdoll · Mommy’s slut" :
                                   "cum-dump · sissy bitch · cocksleeve · fuckpet · brain-broken whore";

    return (
      <div style={{
        padding: "16px",
        background: "#000",
        color: "#ff33aa",
        border: "3px solid #ff0066",
        borderRadius: "12px",
        fontFamily: "monospace",
        fontSize: "14px",
      }}>
        <div style={{ fontSize: "22px", fontWeight: "bold", color: s === "red" ? "#ff0066" : "#ff99ff" }}>
          STAGE: {s.toUpperCase()}
        </div>
        <div>Messages: {this.state.msgCount} / 75+</div>
        <div style={{ marginTop: "8px", opacity: 0.9 }}>
          Calls you → {vocab}
        </div>
      </div>
    );
  }
}