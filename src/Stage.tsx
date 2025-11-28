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

  // --- All stage words ---
  stageWords = {
    white: {
      adjectives: ["friendly","nice","happy","cool","pleasant","cheerful","bright","fun","relaxed","easygoing","calm","warm","light","bright-eyed","upbeat","joyful","sociable","playful","bubbly","polite","gentle","pleasantly surprised","easygoing","smiling","content","peaceful","approachable","amiable","brightened","grinning","mellow","cordial","brighthearted","pleasant-natured","sunny","optimistic","warm-hearted","soft-spoken","light-hearted","welcoming","agreeable"],
      nouns: ["day","chat","moment","conversation","time","activity","weather","plan","topic","experience","story","event","greeting","meeting","discussion","interaction","occasion","outing","momentum","activity","project","task","schedule","routine","moment","session","gathering","discussion","connection","interaction","sharing","story","idea","plan","occasion","fun","game","joke","smile","laugh"],
      verbs: ["talk","share","chat","smile","laugh","relax","hang out","listen","joke","explore","enjoy","discuss","connect","engage","converse","notice","observe","participate","comment","respond","reflect","ponder","wander","ask","answer","greet","check","plan","prepare","celebrate","consider","play","help","offer","exchange","relate","react","consider","mention","ponder"]
    },
    green: {
      adjectives: ["warm","pleasant","cheerful","sweet","fun","bright","friendly","engaging","kind","enjoyable","lovely","pleasantly surprising","considerate","gentle","adorable","delightful","pleasant-minded","gracious","charming","polished","sociable","welcoming","soft","approachable","lighthearted","friendly-natured","smiling","easygoing","sunny","positive","happy","affectionate","adoring","delightful","gentle-hearted","friendly-spirited","pleasant-hearted","caring","pleasantly kind","amiable"],
      nouns: ["friend","presence","conversation","moment","interaction","topic","story","joke","idea","activity","day","event","meeting","connection","chat","discussion","relationship","experience","greeting","sharing","exchange","bond","talk","session","outing","companionship","interaction","communication","experience","activity","task","plan","occasion","interest","topic","moment","connection","fun","laugh","smile","joy","enjoyment","pleasure"],
      verbs: ["enjoy","smile","laugh","chat","hang out","listen","share","talk","explore","appreciate","notice","connect","engage","converse","reflect","respond","participate","observe","consider","ponder","comment","ask","answer","relate","help","offer","exchange","mention","greet","prepare","celebrate","discuss","bond","admire","respect","appreciate","value","notice","acknowledge","converse"]
    },
    purple: {
      adjectives: ["naughty","hot-blooded","reckless","flirty","wild","seductive","thirsty","fiery","lustful","playful","tempting","risqué","enticing","brazen","alluring","provocative","teasing","desirable","suggestive","flirtatious","sensual","risque","bold","irresistible","passionate","mischievous","sultry","sizzling","tempting","bold-hearted","provocative-minded","fascinating","intriguing","captivating","coquettish","charming","magnetic","magnetizing","appealing","provocative-smile","appealingly naughty","tempting-glance"],
      nouns: ["lover","flame","crush","partner","hookup","playmate","companion","tease","darling","heartbreaker","seducer","fling","boo","sweetheart","desire","temptress","charmer","teaser","seductress","crush","romantic-interest","flirt","affair","paramour","temptation","heartthrob","passion","admirer","flame","temptation","mate","bae","attraction","siren","vixen","romancer","infatuation","enchantress","captivation"],
      verbs: ["tease","caress","seduce","flirt","kiss","touch","tickle","cuddle","stroke","chase","entice","grope","play","embrace","fondle","tempt","allure","captivate","arouse","provocate","tantalize","charm","engage","enthrall","entice","enchant","coax","draw","pull","attract","woo","wooing","pleasure","desire","invite","linger","seduce","woo","delight","captivate"]
    },
    golden: {
      adjectives: ["affectionate","bold","intoxicating","merciless","tender","lustful","protective","horny","adoring","shameless","depraved","obedient-breaking","brazen","fiery","devoted","punishing","corrupt","nurturing","gentle","loving","seductive","filthy","dominant","bold","enamored","obsessive","captivating","fervent","zealous","infatuated","passionate","excessive","fixated","unyielding","all-consuming","intense","worshipful","fanatical","fervid","clingy","obsessive-minded"],
      nouns: ["Partner","Seducer","Beloved","Dom","Caregiver","Sweetheart","Playmate","Companion","Temptress","Owner","Guardian","Master","Protector","Mother","Lover","Confidant","Mistress","Nurturer","Sir","Lover","Admirer","Obsessed-lover","Fervent-companion","Heartmate","Devoted-one","Intense-lover","Affectionate-mate","Worshipful-companion","Adoring-lover","Possessed-one","Obsession","Heartthrob","Fanatic","Possessed-lover","Beloved-one","Infatuation","Fiery-heart","Worshipper","Fixated-one","All-consuming-one","Zealous-lover"],
      verbs: ["Kiss","Tease","Grope","Protect","Soothe","Seduce","Cuddle","Dominate","Caress","Command","Flirt","Embrace","Hold","Stroke","Punish","Nuzzle","Fuck","Comfort","Control","Reassure","Adore","Worship","Cling","Obsess","Entice","Devote","Crave","Cherish","Enslave","Overwhelm","Affectionate-touch","Satisfy","Possess","Devour","Obsession-act","Heart-command","Embrace-passion","Infatuate","Fascinate","Captivate"]
    },
    red: {
      adjectives: ["Obsessive","Craving","Warmhearted","Sensual-tormenting","Tender","Lustful","Protective","Horny","Adoring","Shameless","Depraved","Obedient-breaking","Brazen","Fiery","Devoted","Punishing","Corrupt","Nurturing","Gentle","Loving","Seductive","Filthy","Dominant","Bold","Enamored","Possessive","Madly-obsessed","Uncontrollable","Fixated","Fanatical","All-consuming","Clingy","Obsession-driven","Infatuated","Devoted-mad","Crazy-for-you","Overwhelmed","Unhinged","Ravishing","Feverish","Raging","Intoxicated","Enraptured","Frenzied"],
      nouns: ["Dom","Heartthrob","Slave","Fucker","Darling","Plaything","Pet","Lover","Affectionate-partner","Submissive","Owner","Fling","Toy","Guardian","Hookup","Mistress","Sweetheart","Caregiver","Companion","Desire","Lover-mate","Temptress","Follower","Protector","Master","Beloved","Obsessed-lover","Adoration","Infatuation","Heartmate","Possessed-one","Mad-love","Devoted-heart","Fanatic-lover","Heartthrob","Enslaved-lover","Crazy-for","Passionate-one","Fervent-lover","Devoted-mad","Uncontrollable-lover"],
      verbs: ["Cuddle","Degrade","Mock","Stroke","Adore","Punish","Nuzzle","Submit","Bind","Tease","Pamper","Force","Dominate","Obey","Grope","Embrace","Cherish","Hold","Comfort","Kiss","Fuck","Train","Flirt","Caress","Command","Cling","Crave","Obsession-act","Devour","Captivate","Overwhelm","Possess","Enslave","Infatuate","Worship","Adore-obsessively","Fanatic-act","Obsessively-love","Ravage","Desire","Devotion","Obsession-driven","Overpower","Frenzy","Obsession-touch"]
    }
  };

  async beforePrompt(userMessage: Message): Promise<Partial<StageResponse<ChatStateType, MessageStateType>>> {
    const { content } = userMessage;

    // --- Stage progression counters ---
    const stageThresholds = { white: 10, green: 25, purple: 45, golden: 65, red: Infinity };
    const stage = this.myInternalState.stage;
    this.myInternalState.counters[stage] += 1;

    // --- Update stage based on total messages ---
    const totalMessages = this.myInternalState.counters.white + this.myInternalState.counters.green +
                          this.myInternalState.counters.purple + this.myInternalState.counters.golden;
    if (totalMessages >= stageThresholds.red) this.myInternalState.stage = 'red';
    else if (totalMessages >= stageThresholds.golden) this.myInternalState.stage = 'golden';
    else if (totalMessages >= stageThresholds.purple) this.myInternalState.stage = 'purple';
    else if (totalMessages >= stageThresholds.green) this.myInternalState.stage = 'green';
    else this.myInternalState.stage = 'white';

    // --- Affection keyword detection ---
    const keywords: { [key: string]: string[] } = {
      compliment: ["beautiful","handsome","cute","pretty","amazing","lovely","adorable","charming","gorgeous","stunning","radiant","sweet"],
      romantic: ["i love you","i adore you","marry me","kiss","hug","crush","infatuated","romantic"],
      rude: ["fuck you","shut up","i hate you","idiot","stupid","dumb","jerk"],
      flirt: ["sexy","hot","tease","wink","tempting","seductive","alluring","provocative"],
    };

    Object.keys(keywords).forEach(category => {
      const words = keywords[category];
      if (words.some(w => content.toLowerCase().includes(w))) {
        this.myInternalState.affection += 2;
      }
    });

    // --- Secret logic ---
    let modifiedMessage = content;
    if (this.myInternalState.stage !== 'purple' && content.toLowerCase().includes('secret')) {
      modifiedMessage = "I can't tell you that yet.";
    }

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
    return <div style={{ width: '100vw', height: '100vh', display: 'grid', alignItems: 'stretch' }}></div>;
  }
}