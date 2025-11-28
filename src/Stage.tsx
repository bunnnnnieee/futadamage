// stages/stage.tsx
import { ReactElement } from "react";
import { StageBase, StageResponse, InitialData, Message } from "@chub-ai/stages-ts";
import { LoadResponse } from "@chub-ai/stages-ts/dist/types/load";

// --- Types for state ---
type StageName = "white" | "green" | "purple" | "golden" | "red";

interface MessageStateType {
  msgCount: number;
  stage: StageName;
  secretUnlocked: boolean;
}

type ConfigType = any;
type InitStateType = any;
type ChatStateType = any;

// --- Full Stage Skeleton ---
export class StageImpl extends StageBase<InitStateType, ChatStateType, MessageStateType, ConfigType> {
  state: MessageStateType;

  constructor(data: InitialData<InitStateType, ChatStateType, MessageStateType, ConfigType>) {
    super(data);
    this.state = data.messageState ?? { msgCount: 0, stage: "white", secretUnlocked: false };
  }

  async load(): Promise<Partial<LoadResponse<InitStateType, ChatStateType, MessageStateType>>> {
    return { success: true, error: null, initState: null, chatState: null };
  }

  private getStage(count: number): StageName {
    if (count >= 75) return "red";
    if (count >= 45) return "golden";
    if (count >= 25) return "purple";
    if (count >= 10) return "green";
    return "white";
  }

  private pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  private getInject(stage: StageName, secretUnlocked: boolean): string {
    const white = [
      "Hey cutie, come cuddle with me, I missed you all day long.",
      "Made your favorite snacks, wanna sit on my lap and watch something silly together?",
      "You’re literally the most adorable thing ever when you blush like that.",
      "Tell me everything about your day, baby, I wanna know every detail.",
    ];

    const green = [
      "Aww my sweet angel, let big sis hold you tight forever okay?",
      "You did so good today, I’m seriously proud of my perfect boy.",
      "Come rest on my chest, let me stroke your hair until you relax.",
    ];

    const purple = [
      "You’d look so fucking pretty in a tiny skirt and thigh-highs, princess.",
      "Keep acting shy, it just makes me wanna bend you over and ruin you.",
      "Call me big sis again, my cock twitches every time you do.",
    ];

    const golden = [
      "Open wide, princess — time for your daily estrogen pill like a good girl.",
      "Click. Cage locked forever. That clitty belongs to Mommy now.",
      "Bend over, Mommy’s stretching that boypussy with three fingers tonight.",
      "After I breed you I’ll cuddle you and kiss every tear away, baby.",
    ];

    const red = [
      "On your knees, worthless sissy cum-rag — open that painted mouth for my cock.",
      "Your locked dicklet drips while my fat balls slap your chin again and again.",
      "Everyone thinks we’re perfect — they don’t know I just bred you in public.",
      "I’m addicted to filling you every hour, you’re my personal walking cum-dump.",
      "Spread those cheeks, cheap whore — Daddy’s nuts need to empty inside you again.",
      "Lick my sweaty balls clean then beg for another thick load down your throat.",
      "You’re just a warm cocksleeve with tits now — say it loud, bitch.",
      "Good girl, moan my name while I breed you raw — I love you more than life.",
    ];

    // Secret unlock only in purple and beyond
    if (!secretUnlocked && stage === "purple") return "Secret unlocked! You may now see forbidden thoughts...\n";

    switch (stage) {
      case "white": return this.pick(white);
      case "green": return this.pick(green);
      case "purple": return this.pick(purple);
      case "golden": return this.pick(golden);
      case "red": return this.pick(red);
    }
  }

  async beforePrompt(userMessage: Message): Promise<Partial<StageResponse<ChatStateType, MessageStateType>>> {
    this.state.msgCount += 1;
    this.state.stage = this.getStage(this.state.msgCount);

    // Unlock secret at purple
    if (!this.state.secretUnlocked && this.state.stage === "purple") {
      this.state.secretUnlocked = true;
    }

    const injectText = this.getInject(this.state.stage, this.state.secretUnlocked);
    userMessage.content = `[${this.state.stage.toUpperCase()}] ${userMessage.content.trim()}\n${injectText}`;

    return { messageState: this.state };
  }

  async afterResponse(botMessage: Message): Promise<Partial<StageResponse<ChatStateType, MessageStateType>>> {
    // Optional debug info
    botMessage.content += `\n(Stage: ${this.state.stage}, MsgCount: ${this.state.msgCount})`;
    return { messageState: this.state };
  }

  render(): ReactElement {
    const s = this.state.stage;
    return (
      <div style={{
        padding: "16px",
        background: "#000",
        color: "#ff33aa",
        border: "3px solid #ff0066",
        borderRadius: "12px",
        fontFamily: "monospace"
      }}>
        <div style={{ fontSize: "22px", fontWeight: "bold", color: s === "red" ? "#ff0066" : "#ff99ff" }}>
          STAGE: {s.toUpperCase()}
        </div>
        <div>Messages: {this.state.msgCount}</div>
        <div>Secret Unlocked: {this.state.secretUnlocked ? "YES" : "NO"}</div>
      </div>
    );
  }
}