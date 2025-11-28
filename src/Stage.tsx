import { Stage, OnUserMessage } from "chub-ai"

type Rarity = "white" | "green" | "purple" | "golden" | "red"

interface MessageStateType {
  stage: Rarity
  counters: Record<Rarity, number>
  affection: number
}

const stageWords = {
  white: {
    adj:["cute","soft","adorable","sweet","tiny","innocent","shy","fresh","lovable"],
    noun:["starter","novice","little one","bud","kitten","angel","darling"],
    verb:["learn","study","kiss","pet","hold","snuggle","boop","guide"]
  },
  green:{
    adj:["good","perfect","focused","amazing","brave","smart"],
    noun:["good trainee","team member","partner","treasure"],
    verb:["praise","reward","protect","teach","spoil","comfort"]
  },
  purple:{
    adj:["bold","teasing","horny","lewd","needy","greedy","flirty"],
    noun:["princess","tester","brat","toy","pet","minx","troublemaker"],
    verb:["tease","challenge","spank","grope","edge","deny","mock"]
  },
  golden:{
    adj:["obedient","perfect","owned","trained","submissive","devoted"],
    noun:["good subject","property","pet","doll","toy","angel"],
    verb:["cage","lock","train","break","own","collar","serve","beg"]
  },
  red:{
    adj:["worthless","pathetic","ruined","mindless","feral","obsessed"],
    noun:["master's tool","subject","forever slave","brainless doll"],
    verb:["destroy","subdue","break forever","humiliate","mind-break"]
  }
}

const pick = <T,>(arr:T[]) => arr[Math.floor(Math.random()*arr.length)];

function updateStage(state:MessageStateType) {
  const t = Object.values(state.counters).reduce((a,b)=>a+b,0);
  if(t>=1000) state.stage="red";
  else if(t>=65) state.stage="golden";
  else if(t>=45) state.stage="purple";
  else if(t>=25) state.stage="green";
  else state.stage="white";
}

function updateAffection(state:MessageStateType, msg:string) {
  const c = msg.toLowerCase();
  let p=0;
  ["cute","beautiful","sweet","good"].some(w=>c.includes(w)) && (p+=3);
  ["hot","sexy","tease"].some(w=>c.includes(w)) && (p+=5);
  ["stupid","idiot","bad"].some(w=>c.includes(w)) && (p-=4);
  state.affection = Math.min(100,Math.max(0,state.affection+p));
}

export const stage: Stage<MessageStateType> = {
  id: "progression-v1",
  initialState: {
    stage:"white",
    counters:{white:0,green:0,purple:0,golden:0,red:0},
    affection:50
  },

  onUserMessage: async (ctx) => {
    const state = ctx.state;
    const cur = state.stage;

    state.counters[cur] += 1;
    updateStage(state);
    updateAffection(state, ctx.message.content);

    const w = stageWords[state.stage];
    const injection = `(${pick(w.adj)}) ${pick(w.noun)}, let's ${pick(w.verb)}.`;

    return {
      reply: `${ctx.message.content}\n\n${injection}`,
      state
    }
  }
}
