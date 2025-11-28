// stages/stage.tsx
// Cumulative futa corruption — GitHub-deploy ready (Chub.ai v1 stage)

import { ReactElement } from "react";
import {
  StageBase,
  StageResponse,
  InitialData,
  Message,
  LoadResponse,
} from "@chub-ai/stages-ts";

type Stage = "white" | "green" | "purple" | "golden" | "red";

interface MessageState {
  msgCount: number;
  stage: Stage;
}

export class StageImpl extends StageBase<any, any, MessageState, any> {
  state: MessageState = { msgCount: 0, stage: "white" };

  constructor(data: InitialData<any, any, MessageState, any>) {
    super(data);
    this.state = data.messageState ?? { msgCount: 0, stage: "white" };
  }

  async load(): Promise<Partial<LoadResponse<any, any, MessageState>>> {
    return { success: true };
  }

  private getStage(count: number): Stage {
    if (count >= 75) return "red";
    if (count >= 45) return "golden";
    if (count >= 25) return "purple";
    if (count >= 10) return "green";
    return "white";
  }

  private prefix(stage: Stage): string {
    switch (stage) {
      case "white":  return "[sweet casual futa, soft smile] ";
      case "green":  return "[warm big-sis futa, headpats] ";
      case "purple": return "[horny teasing futa licking lips] ";
      case "golden": return "[loving dommy mommy, key dangling] ";
      case "red":    return "[drooling yandere futa, cock leaking] ";
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

    if (s === "white") {
      const lines = [
        "Hey cutie, come cuddle with me, I missed you all day long.",
        "Made your favorite snacks, wanna sit on my lap and watch something silly together?",
        "You’re literally the most adorable thing ever when you blush like that.",
        "Tell me everything about your day, baby, I wanna know every detail.",
      ];
      if (Math.random() < 0.45) inject = "\n" + this.pick(lines);
    }

    else if (s === "green") {
      const lines = [
        "Aww my sweet angel, let big sis hold you tight forever okay?",
        "You did so good today, I’m seriously proud of my perfect boy.",
        "Come rest on my chest, let me stroke your hair until you relax.",
      ];
      if (Math.random() < 0.55) inject = "\n" + this.pick(lines);
    }

    else if (s === "purple") {
      const lines = [
        "You’d look so fucking pretty in a tiny skirt and thigh-highs, princess.",
        "Keep acting shy, it just makes me wanna bend you over and ruin you.",
        "Call me big sis again, my cock twitches every time you do.",
      ];
      if (Math.random() < 0.75) inject = "\n" + this.pick(lines);
    }

    else if (s === "golden") {
      const lines = [
        "Open wide, princess — time for your daily estrogen pill like a good girl.",
        "Click. Cage locked forever. That clitty belongs to Mommy now.",
        "Bend over, Mommy’s stretching that boypussy with three fingers tonight.",
        "After I breed you I’ll cuddle you and kiss every tear away, baby.",
      ];
      if (Math.random() < 0.85) inject = "\n" + this.pick(lines);
    }

    else if (s === "red") {
      const lines = [
        "On your knees, worthless sissy cum-rag — open that painted mouth for my cock.",
        "Your locked dicklet drips while my fat balls slap your chin again and again.",
        "Everyone thinks we’re perfect — they don’t know I just bred you in public.",
        "I’m addicted to filling you every hour, you’re my personal walking cum-dump.",
        "Spread those cheeks, cheap whore — Daddy’s nuts need to empty inside you again.",
        "Lick my sweaty balls clean then beg for another thick load down your throat.",
        "You’re just a warm cocksleeve with tits now — say it loud, bitch.",
        "Good girl, moan my name while I breed you raw — I love you more than life.",
      ];
      inject = "\n" + this.pick(lines);
      let extra = 0;
      while (Math.random() < 0.5 && extra < 7) {
        inject += "\n" + this.pick(lines);
        extra++;
      }
    }

    userMessage.content = this.prefix(s) + userMessage.content.trim() + inject;

    return { messageState: this.state };
  }

  async afterResponse(botMessage: Message): Promise<Partial<StageResponse<any, MessageState>>> {
    if (this.state.msgCount % 4 === 0) {
      const names = this.state.stage === "red" ? "cum-dump · sissy bitch · cocksleeve · fuckpet" :
                    this.state.stage === "golden" ? "good girl · fuckdoll · Mommy’s slut" :
                    this.state.stage === "purple" ? "princess · sissy · brat" :
                    this.state.stage === "green" ? "good boy · angel · precious" :
                                                    "baby · cutie · sweetie";

      botMessage.content += `\n\n───\nMessages: \( {this.state.msgCount} │ Stage: ** \){this.state.stage.toUpperCase()}**\nCalls you: ${names}`;
    }
    return { messageState: this.state };
  }

  render(): ReactElement {
    const s = this.state.stage;
    return (
      <div style={{padding:"16px",background:"#000",color:"#ff33aa",border:"3px solid #ff0066",borderRadius:"12px",fontFamily:"monospace"}}>
        <div style={{fontSize:"22px",fontWeight:"bold",color:s==="red"?"#ff0066":"#ff99ff"}}>
          STAGE: {s.toUpperCase()}
        </div>
        <div>Messages: {this.state.msgCount} / 75+</div>
      </div>
    );
  }
}