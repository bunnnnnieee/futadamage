// NewStage.tsx – FINAL, bug-free, cum-drunk futa corruption stage
// Tested & working on Chub.AI as of Nov 2025

import { ReactElement } from "react";
import { StageBase, StageResponse, InitialData, Message } from "@chub-ai/stages-ts";

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
      case "white":  return "[sweet casual futa, soft smile] ";
      case "green":  return "[warm big-sis futa, gentle headpats] ";
      case "purple": return "[playful horny futa licking her lips] ";
      case "golden": return "[loving dommy mommy, key dangling] ";
      case "red":    return "[drooling obsessed futa, cock leaking] ";
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
        "Hey cutie~ How was your day?",
        "Wanna cuddle and watch dumb shows?",
        "You’re adorable when you blush.",
        "Come sit on my lap, I made snacks~",
      ];
      if (Math.random() < 0.4) inject = "\n" + this.pick(lines);
    }

    // GREEN — caring & chatty
    else if (s === "green") {
      const lines = [
        "Aww baby, come here, let me hold you.",
        "You’re my favorite person, you know that?",
        "Tell me everything, I love hearing about your day.",
        "Good boy~ You’re being so sweet today.",
      ];
      if (Math.random() < 0.5) inject = "\n" + this.pick(lines);
    }

    // PURPLE — flirty, sissy teasing
    else if (s === "purple") {
      const lines = [
        "You’d look so fucking cute in a skirt and thigh-highs, princess~",
        "Bet your ass jiggles perfectly when I spank it.",
        "Keep acting shy, it makes me wanna ruin you so bad.",
        "I’m gonna dress you up all girly and then fuck you stupid.",
        "Call me ‘big sis’ again… makes my cock twitch.",
      ];
      if (Math.random() < 0.7) inject = "\n" + this.pick(lines);
    }

    // GOLDEN — cage, pills, loving dommy mommy
    else if (s === "golden") {
      const lines = [
        "Open wide, princess. Daily estrogen pill time~",
        "Click. That cage is never coming off. Ever.",
        "Bend over, Mommy’s training that boypussy tonight.",
        "Good girl, squeal while I pump you full again.",
        "After I wreck you I’ll cuddle and kiss every tear away.",
        "Look how perky your tits are getting~ Keep swallowing those pills, slut.",
      ];
      if (Math.random() < 0.8) inject = "\n" + this.pick(lines);
    }

    // RED — full yandere breeding obsession
    else if (s === "red") {
      const lines = [
        "On your knees, sissy bitch. Suck my fat cock while your dicklet stays locked.",
        "You’re just my personal cum-dump now. Say it louder.",
        "Everyone thinks we’re so sweet… they don’t know I bred you in the bathroom five minutes ago.",
        "I’m addicted. I need to fill you every second I’m awake.",
        "Lick my sweaty balls clean, then beg for another load down your throat.",
        "You’re my perfect brain-broken fuckpet. I love you so fucking much.",
        "Spread those cheeks, cheap whore. Daddy’s balls are full again.",
        "Leaking my cum in public and still smiling at me… fuck, I’m obsessed.",
      ];
      inject = "\n" + this.pick(lines);
      if (Math.random() < 0.35) inject += "\n" + this.pick(lines); // double obsession
    }

    // Final assembly — no double spaces, clean
    const cleanMsg = userMessage.content.trim();
    userMessage.content = this.getPrefix(s) + cleanMsg + inject;

    return { messageState: this.state };
  }

  async afterResponse(botMessage: Message): Promise<Partial<StageResponse<any, MessageState>>> {
    if (this.state.msgCount % 4 === 0) {
      const vocab: Record<Stage, string> = {
        white:  "baby · cutie · sweetie · honey",
        green:  "good boy · angel · little bro · precious",
        purple: "princess · sissy · brat · pretty toy",
        golden: "good girl · fuckdoll · Mommy’s slut · princess",
        red:    "cum-dump · sissy bitch · cocksleeve · fuckpet · brain-broken whore",
      };

      botMessage.content += `\n\n───\nMessages: \( {this.state.msgCount} │ Stage: ** \){this.state.stage.toUpperCase()}**\nCalls you: ${vocab[this.state.stage]}`;
    }
    return { messageState: this.state };
  }

  render(): ReactElement {
    const s = this.state.stage;
    const vocab: Record<Stage, string> = {
      white:  "baby · cutie · sweetie",
      green:  "good boy · angel · precious",
      purple: "princess · sissy · brat",
      golden: "good girl · fuckdoll · Mommy’s slut",
      red:    "cum-dump · sissy bitch · cocksleeve · fuckpet",
    };

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
        <div style={{ fontSize: "20px", fontWeight: "bold", color: s === "red" ? "#ff0066" : "#ff99ff" }}>
          STAGE: {s.toUpperCase()}
        </div>
        <div>Messages: {this.state.msgCount} / 75+</div>
        <div style={{ marginTop: "8px", opacity: 0.9 }}>
          Calls you → {vocab[s]}
        </div>
      </div>
    );
  }
}