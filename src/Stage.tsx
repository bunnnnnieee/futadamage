// stages/stage.tsx
import { ReactElement } from "react";
import { StageBase, StageResponse, Message, InitialData } from "@chub-ai/stages-ts";

type StageName = "white" | "green" | "purple" | "golden" | "red";

interface MessageState {
  msgCount: number;
  stage: StageName;
}

export default class StageImpl extends StageBase<any, any, MessageState, any> {
  state: MessageState;

  constructor(data: InitialData<any, any, MessageState, any>) {
    super(data);
    this.state = data.messageState ?? { msgCount: 0, stage: "white" };
  }

  private getStage(msgCount: number): StageName {
    if (msgCount >= 75) return "red";
    if (msgCount >= 45) return "golden";
    if (msgCount >= 25) return "purple";
    if (msgCount >= 10) return "green";
    return "white";
  }

  async beforePrompt(userMessage: Message): Promise<Partial<StageResponse<any, MessageState>>> {
    this.state.msgCount += 1;
    this.state.stage = this.getStage(this.state.msgCount);

    // Example: prefix stage for AI behavior
    userMessage.content = `[${this.state.stage.toUpperCase()}] ${userMessage.content}`;

    return { messageState: this.state };
  }

  async afterResponse(botMessage: Message): Promise<Partial<StageResponse<any, MessageState>>> {
    // Optional: append some debug info for testing
    botMessage.content += `\n(Stage: ${this.state.stage}, MsgCount: ${this.state.msgCount})`;
    return { messageState: this.state };
  }

  render(): ReactElement {
    return (
      <div style={{
        padding: "16px",
        background: "#000",
        color: "#ff33aa",
        border: "3px solid #ff0066",
        borderRadius: "12px",
        fontFamily: "monospace"
      }}>
        <div style={{
          fontSize: "22px",
          fontWeight: "bold",
          color: this.state.stage === "red" ? "#ff0066" : "#ff99ff"
        }}>
          STAGE: {this.state.stage.toUpperCase()}
        </div>
        <div>Messages: {this.state.msgCount}</div>
      </div>
    );
  }
}