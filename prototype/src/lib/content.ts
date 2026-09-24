// All fictional. The same pieces appear in every prototype so they can be compared.

export type Theme = 'feeling' | 'control' | 'slowing' | 'remembering' | 'integration' | 'love' | 'free'

export type Mood = 'Anxious' | 'Lost' | 'Restless' | 'Curious' | 'Heavy' | 'Open'
export const MOODS: Mood[] = ['Anxious', 'Lost', 'Restless', 'Curious', 'Heavy', 'Open']

export type Track = {
  id: string
  title: string
  seconds: number
  theme: Theme
  moods: Mood[]
  context: string
  /** how many people sat with it today (radio) / this week (room) */
  sitting: number
}

export const TRACKS: Track[] = [
  { id: 't1', title: 'What are you actually trying not to feel?', seconds: 384, theme: 'feeling', moods: ['Heavy', 'Restless'], context: 'Morning video. Recorded in the car before a session.', sitting: 23 },
  { id: 't2', title: "Slow down. You don't have to solve this right now.", seconds: 272, theme: 'slowing', moods: ['Anxious', 'Restless'], context: 'Recorded on a walk. There are birds. Leave them in.', sitting: 7 },
  { id: 't3', title: "Control feels like safety. It isn't.", seconds: 310, theme: 'control', moods: ['Anxious', 'Curious'], context: 'Answering a question someone asked on Telegram.', sitting: 5 },
  { id: 't4', title: "You didn't lose it. You just don't keep it at home.", seconds: 422, theme: 'remembering', moods: ['Lost', 'Heavy'], context: 'On outsourcing. The short version.', sitting: 9 },
  { id: 't5', title: 'The Tuesday test', seconds: 228, theme: 'integration', moods: ['Curious', 'Open'], context: 'An insight counts when it changes your Tuesday.', sitting: 4 },
  { id: 't6', title: "You don't need to fix what you're feeling.", seconds: 245, theme: 'feeling', moods: ['Heavy', 'Anxious'], context: 'Four minutes. Mostly silence at the end, on purpose.', sitting: 11 },
  { id: 't7', title: 'Nobody gave you a map.', seconds: 341, theme: 'remembering', moods: ['Lost', 'Curious'], context: "For the ones who went looking and didn't come back the same.", sitting: 6 },
  { id: 't8', title: 'Three breaths before you reach for it.', seconds: 177, theme: 'slowing', moods: ['Restless', 'Anxious'], context: 'A practice, not a talk. Do it while it plays.', sitting: 8 },
  { id: 't9', title: "Use the structure until you don't need it.", seconds: 260, theme: 'integration', moods: ['Open', 'Curious'], context: 'On scaffolding, and taking it down.', sitting: 3 },
  { id: 't10', title: 'Everyone you meet is also pretending to be okay.', seconds: 213, theme: 'love', moods: ['Heavy', 'Open'], context: 'Recorded after a long ceremony weekend. Tired voice.', sitting: 5 },
]

export const track = (id: string) => TRACKS.find((t) => t.id === id)!

export const fmt = (s: number) => {
  const m = Math.floor(s / 60)
  const r = Math.floor(s % 60)
  return `${m}:${r.toString().padStart(2, '0')}`
}

// ---------------------------------------------------------------- reflections

export type Reply = { id: string; author: string; text: string; when: string }
export type Reflection = {
  id: string
  on: string // track id or topic id
  author: string
  anonymous?: boolean
  text: string
  when: string
  replies: Reply[]
  mine?: boolean
}

export const SEED_REFLECTIONS: Reflection[] = [
  // The Room — t1
  { id: 'r1', on: 't1', author: 'Maya', text: "Boredom. Not sadness, not grief. Plain boredom. I'd rather feel anything than that, so I pick up the phone. Sat here and let it be boring for six minutes. Nobody died.", when: 'this morning', replies: [{ id: 'r1a', author: 'Tomás', text: "Same. Boredom is the one I never suspected.", when: 'this morning' }] },
  { id: 'r2', on: 't1', author: 'Someone', anonymous: true, text: "That I miss my dad. It's been four years and I still reach for a drink around 6pm, which is when he used to call.", when: 'yesterday', replies: [{ id: 'r2a', author: 'Oriya', text: "Thank you for putting that on the table. 6pm doesn't have to be a battle. It can be when you call him back, in whatever way that means.", when: 'yesterday' }] },
  { id: 'r3', on: 't1', author: 'Dev', text: "Honestly? That I'm fine. That nothing is wrong. If nothing is wrong then I don't have a project and I don't know who I am without a project.", when: 'yesterday', replies: [] },
  { id: 'r4', on: 't1', author: 'Ines', text: 'Being a beginner. Anything I am not already good at, I avoid. Including this.', when: 'Monday', replies: [] },
  // Radio — t2 and friends
  { id: 'r5', on: 't2', author: 'Lior', text: 'I had four tabs open about my visa. Closed three. The fourth can wait until tomorrow.', when: 'an hour ago', replies: [] },
  { id: 'r6', on: 't2', author: 'Hana', text: 'Listened while the kettle boiled. Heard the birds more than the words. That was probably the point.', when: 'this morning', replies: [] },
  { id: 'r7', on: 't2', author: 'Someone', anonymous: true, text: "I solve things so I don't have to feel them. This was hard to listen to.", when: 'this morning', replies: [{ id: 'r7a', author: 'Kofi', text: 'Hard in a good way, I hope. I do the exact same thing.', when: 'this morning' }] },
  { id: 'r8', on: 't6', author: 'June', text: "Didn't fix it. It's still here. But it's smaller when I stop arguing with it.", when: 'yesterday', replies: [] },
  { id: 'r9', on: 't3', author: 'Rafa', text: "I plan my weekends to the hour. Now I'm wondering what I'm protecting myself from.", when: 'yesterday', replies: [] },
  { id: 'r10', on: 't4', author: 'Kofi', text: 'My calm lives in a vape. Has for six years. I never thought of it as mine to take back.', when: 'Sunday', replies: [] },
  { id: 'r11', on: 't8', author: 'Maya', text: 'Did the three breaths before opening Instagram. Then opened it anyway. But slower.', when: 'this morning', replies: [] },
  { id: 'r12', on: 't5', author: 'Tomás', text: "Tuesday test failed at 9:14am when my boss emailed. Passed at 9:20. Progress.", when: 'yesterday', replies: [] },
  { id: 'r13', on: 't7', author: 'Hana', text: 'The word "unaccompanied" undid me a bit.', when: 'Saturday', replies: [] },
  { id: 'r14', on: 't9', author: 'Dev', text: 'Using the structure. Not ready to not need it. That feels okay to say.', when: 'yesterday', replies: [] },
  { id: 'r15', on: 't10', author: 'June', text: 'Told the cashier I was tired instead of "great, you?". She laughed and said same.', when: 'yesterday', replies: [] },
  // Topics
  { id: 'q1', on: 'questions', author: 'Rafa', text: 'How do you tell the difference between slowing down and avoiding? Sometimes "sitting with it" feels like a fancy word for procrastinating.', when: 'yesterday', replies: [{ id: 'q1a', author: 'Oriya', text: "Good question, and a bit of a trap. Avoiding has a direction: away. Slowing down doesn't go anywhere. If you're not sure, ask your body which one it's doing. It knows before you do.", when: 'yesterday' }] },
  { id: 'q2', on: 'questions', author: 'Ines', text: "Is it normal that meditation makes the anxiety louder at first?", when: 'Monday', replies: [{ id: 'q2a', author: 'Lior', text: 'For me, yes. The volume was always that high. I just finally stopped talking over it.', when: 'Monday' }] },
  { id: 's1', on: 'stories', author: 'Kofi', text: "Day 40 without the vape. Not white-knuckling it. I just noticed I'd forgotten it in my other jacket for a week and didn't go looking. That's the whole story.", when: 'Sunday', replies: [{ id: 's1a', author: 'Maya', text: 'The other jacket. I love this.', when: 'Sunday' }] },
  { id: 's2', on: 'stories', author: 'Someone', anonymous: true, text: 'Called my brother for the first time in two years. We talked about football for an hour. Neither of us mentioned anything. It was perfect.', when: 'last week', replies: [] },
  { id: 'm1', on: 'meditations', author: 'June', text: 'The breathing one from Tuesday, done lying on the kitchen floor. Recommend the kitchen floor.', when: 'yesterday', replies: [] },
  { id: 'w1', on: 'medicine', author: 'Dev', text: "Three months after the retreat and I'm grieving that the feeling faded. Anyone else?", when: 'Monday', replies: [{ id: 'w1a', author: 'Oriya', text: "Everyone. The feeling was never the point, it was a preview. The work is Tuesday. You're doing it right now by asking.", when: 'Monday' }] },
  { id: 'x1', on: 'remembering', author: 'Hana', text: 'I used to sing in the car before I got self-conscious about it. Sang today. Badly.', when: 'yesterday', replies: [] },
  { id: 'y1', on: 'resources', author: 'Lior', text: 'The long version on stopbattling.com, if someone is new. Read it slowly.', when: 'last week', replies: [] },
]

// ---------------------------------------------------------------- journal

export type JournalEntry = {
  id: string
  date: string // ISO
  text: string
  source?: string
  theme: Theme
}

export const SEED_JOURNAL: JournalEntry[] = [
  { id: 'j0', date: '2026-06-14', text: "When the craving comes I ask it what it wants. It never answers. Maybe it isn't supposed to.", source: 'You don’t need to fix what you’re feeling.', theme: 'feeling' },
  { id: 'j00', date: '2026-06-20', text: 'I plan everything so nothing can surprise me. Then I call it being organised.', source: 'Written on your own', theme: 'control' },
  { id: 'j1', date: '2026-09-18', text: "I noticed that I don't smoke because I want to feel different. I smoke because I don't want to feel what is already here.", source: 'What are you actually trying not to feel?', theme: 'feeling' },
  { id: 'j2', date: '2026-09-21', text: 'Control feels a lot like safety to me.', source: "Control feels like safety. It isn't.", theme: 'control' },
  { id: 'j3', date: '2026-09-23', text: "I didn't try to change the anxiety today. It passed.", source: 'Slow down. You don’t have to solve this right now.', theme: 'slowing' },
]

// ---------------------------------------------------------------- community spaces

export type Topic = {
  id: string
  name: string
  line: string
  oriya: { text: string; track?: string; when: string }
}

export const TOPICS: Topic[] = [
  { id: 'questions', name: 'Questions', line: 'Ask anything. Nobody is grading.', oriya: { text: "Ask the question you think is stupid. It's usually the one three other people are sitting on.", when: 'last week' } },
  { id: 'stories', name: 'Stories', line: 'Small true things that happened.', oriya: { text: "Not the redemption arc. The Tuesday. What actually happened this week?", when: 'Sunday' } },
  { id: 'meditations', name: 'Meditations', line: 'Sit together, separately.', oriya: { text: 'New one. Eight minutes, no music, one bell at the end.', track: 't8', when: 'Tuesday' } },
  { id: 'medicine', name: 'Medicine work', line: 'Before, during, a long time after.', oriya: { text: "Integration is not a phase after the ceremony. It's the rest of your life. Talk about that here.", track: 't4', when: 'Monday' } },
  { id: 'remembering', name: 'Remembering', line: 'Things you knew before you forgot.', oriya: { text: 'What did you love doing at nine years old that you stopped doing because someone watched?', when: 'yesterday' } },
  { id: 'resources', name: 'Resources', line: 'Books, links, people worth knowing.', oriya: { text: 'Keep this small. One thing that helped, and why.', when: 'last week' } },
]

// ---------------------------------------------------------------- the seven days

export type Day = {
  n: number
  title: string
  track: string
  question: string
  practice: string
  sitSeconds?: number
  act: 1 | 2 | 3 | 4
}

export const DAYS: Day[] = [
  { n: 1, title: 'Notice', track: 't8', question: 'What do you reach for when it gets uncomfortable?', practice: 'Once today, when you reach for your phone, stop. Three breaths. Then do whatever you want.', act: 1 },
  { n: 2, title: 'Where you left it', track: 't4', question: 'Where did you file your calm? A cigarette, a person, a plan?', practice: "Name it once, out loud if you can. Don't fix it. Just name it.", act: 1 },
  { n: 3, title: 'Looking outside', track: 't7', question: 'What have you been hoping would finally fix this?', practice: 'Write down the last three things you bought, booked or downloaded to feel better. Just look at the list.', act: 2 },
  { n: 4, title: 'Slow down', track: 't6', question: 'What happens when you stop trying to change the feeling?', practice: 'Sit for three minutes without reaching for anything.', sitSeconds: 180, act: 3 },
  { n: 5, title: 'Underneath', track: 't1', question: 'What are you actually trying not to feel?', practice: 'When the urge comes today, stay with it for ninety seconds before you decide anything.', sitSeconds: 90, act: 3 },
  { n: 6, title: 'Tuesday', track: 't5', question: 'Think of the most ordinary stressful moment this week. What would you actually do differently now?', practice: "Pick one moment tomorrow to respond slower than usual. That's the whole practice.", act: 4 },
  { n: 7, title: 'Remember', track: 't9', question: 'What did you know as a kid that you forgot?', practice: 'Close the app early today. Go do something with your hands.', act: 4 },
]

export const ACTS: Record<number, { name: string; line: string }> = {
  1: { name: 'Forgetting', line: 'You were handed a story that something is wrong with you. You believed it.' },
  2: { name: 'Seeking', line: 'You reached outside. Teachers, medicines, lovers, plans. It worked, for a while.' },
  3: { name: 'Journey in', line: 'You stopped running long enough to feel what was there.' },
  4: { name: 'Integration', line: 'It shows up on Tuesday, or it doesn’t count.' },
}

// ---------------------------------------------------------------- prototype notes

export const NOTES: Record<string, { name: string; hypothesis: string; strength: string; risk: string; notice: string[] }> = {
  room: {
    name: 'The Room',
    hypothesis: 'People primarily want a shared object of attention, and a conversation around it.',
    strength: 'Strong sense of community. One thing at a time, together.',
    risk: 'Can become another chat platform. The discussion slowly outgrows the audio.',
    notice: [
      "Other people's reflections stay hidden until you ask to see them, so you meet the question before you meet the crowd.",
      'There are no likes. The only number is how many people sat with it.',
      'The other rooms are one quiet link away and never compete with today.',
    ],
  },
  radio: {
    name: 'The Radio',
    hypothesis: "Oriya's archive is the strongest asset, so listening should be effortless: something gets surfaced for you, you don't have to choose.",
    strength: 'Extremely simple way in. One button. Works at 2am on a phone.',
    risk: 'Less obvious community identity. It can drift toward a nicer Spotify.',
    notice: [
      "Mood is optional. The default is 'give me anything'.",
      'Community is one line ("7 people are sitting with this today") until you tap it.',
      'You can scrub the timeline to the end to see what happens when it finishes. The audio is silent in this prototype.',
    ],
  },
  remembership: {
    name: 'Remembership',
    hypothesis: 'A small amount of guided structure helps people integrate ideas without it becoming a course.',
    strength: 'A clear beginning, and a natural reason to go deeper (the 14 days, the membership).',
    risk: 'Can slowly drift into LMS behaviour: days become lessons, lessons become progress bars.',
    notice: [
      'No percentages, no checkmarks. A day just ends with "close the app".',
      "The framework (the Acts) stays invisible until day 7, when it's shown as something you already walked through.",
      'Days unlock one per morning. There is a prototype-only link to skip ahead.',
    ],
  },
}
