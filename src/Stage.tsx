import { ReactElement } from "react";
import { StageBase, StageResponse, InitialData, Message } from "@chub-ai/stages-ts";
import { LoadResponse } from "@chub-ai/stages-ts/dist/types/load";

type MessageStateType = any;
type ConfigType = any;
type InitStateType = any;
type ChatStateType = any;

export class Stage extends StageBase<InitStateType, ChatStateType, MessageStateType, ConfigType> {
  myInternalState: { [key: string]: any };

  constructor(data: InitialData<InitStateType, ChatStateType, MessageStateType, ConfigType>) {
    super(data);
    const { users, characters, messageState } = data;

    this.myInternalState = messageState || {
      stage: 'white',
      counters: { white: 0, green: 0, purple: 0, golden: 0, red: 0 },
      affection: 0,
      secretUnlocked: false
    };

    this.myInternalState.numUsers = Object.keys(users).length;
    this.myInternalState.numChars = Object.keys(characters).length;
  }

  async load(): Promise<Partial<LoadResponse<InitStateType, ChatStateType, MessageStateType>>> {
    return { success: true, error: null, initState: null, chatState: null };
  }

  async setState(state: MessageStateType): Promise<void> {
    if (state != null) this.myInternalState = { ...this.myInternalState, ...state };
  }

  // --- Stage words ---
  stageWords = {
    white: ["Hey cutie, come cuddle with me.", "Made your favorite snacks, wanna sit on my lap?", "Tell me everything about your day, baby."],
    green: ["Aww my sweet angel, let big sis hold you tight.", "You did so good today, I’m proud of you.", "Come rest on my chest, let me stroke your hair."],
    purple: ["You’d look so pretty in a tiny skirt, princess.", "Keep acting shy, it makes me want you.", "Call me big sis again, it drives me wild."],
    golden: ["Open wide, princess — time for your daily pill.", "Cage locked forever. That clitty belongs to Mommy now.", "Bend over, stretching you tonight."],
    red: ["On your knees, worthless sissy cum-rag.", "Your locked dicklet drips while I slap your chin.", "I’m addicted to filling you every hour.", "Spread those cheeks, cheap whore."]
  };

  private pick(stage: string): string {
    const arr = this.stageWords[stage] || [];
    return arr[Math.floor(Math.random() * arr.length)];
  }

  private getTotalMessages(): number {
    return this.myInternalState.counters.white + this.myInternalState.counters.green +
           this.myInternalState.counters.purple + this.myInternalState.counters.golden +
           this.myInternalState.counters.red;
  }

  async beforePrompt(userMessage: Message): Promise<Partial<StageResponse<ChatStateType, MessageStateType>>> {
    const { content } = userMessage;

    // --- Update stage counters ---
    const stageThresholds = { white: 10, green: 25, purple: 45, golden: 65, red: Infinity };
    const currentStage = this.myInternalState.stage;
    this.myInternalState.counters[currentStage] += 1;

    // --- Update stage based on total messages ---
    const totalMessages = this.getTotalMessages();
    if (totalMessages >= stageThresholds.red) this.myInternalState.stage = 'red';
    else if (totalMessages >= stageThresholds.golden) this.myInternalState.stage = 'golden';
    else if (totalMessages >= stageThresholds.purple) this.myInternalState.stage = 'purple';
    else if (totalMessages >= stageThresholds.green) this.myInternalState.stage = 'green';
    else this.myInternalState.stage = 'white';

    // --- Secret unlock at purple ---
    if (!this.myInternalState.secretUnlocked && this.myInternalState.stage === 'purple') {
      this.myInternalState.secretUnlocked = true;
    }

    // --- Block secrets before purple ---
    let modifiedMessage = content;
    if (!this.myInternalState.secretUnlocked && content.toLowerCase().includes('secret')) {
      modifiedMessage = "I can't tell you that yet.";
    }

    // --- Inject stage-specific line ---
    const injectText = this.pick(this.myInternalState.stage);
    modifiedMessage += "\n" + injectText;

    return {
      stageDirections: null,
      messageState: this.myInternalState,
      modifiedMessage,
      systemMessage: null,
      error: null,
      chatState: null,
    };
  }

  async afterResponse(botMessage: Message): Promise<Partial<StageResponse<ChatStateType, MessageStateType>>> {
    return {
      stageDirections: null,
      messageState: this.myInternalState,
      modifiedMessage: null,
      systemMessage: null,
      error: null,
      chatState: null
    };
  }

  render(): ReactElement {
    const s = this.myInternalState.stage;
    return (
      <div style={{ width: '100vw', height: '100vh', display: 'grid', alignItems: 'stretch', background: '#000', color: '#ff33aa', fontFamily: 'monospace' }}>
        <div style={{ fontSize: '22px', fontWeight: 'bold', color: s === 'red' ? '#ff0066' : '#ff99ff' }}>
          STAGE: {s.toUpperCase()}
        </div>
        <div>Messages: {this.getTotalMessages()}</div>
        <div>Secret Unlocked: {this.myInternalState.secretUnlocked ? "YES" : "NO"}</div>
      </div>
    );
  }
}