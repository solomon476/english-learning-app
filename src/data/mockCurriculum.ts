// Solian Wolves Learning Platform: Curated Seed Curriculum
// Grounded in verified sources with multi-level explanations and server-evaluated quizzes.

import { Topic, ServerQuestion, ContentSource } from '../types';

export const MOCK_SOURCES: Record<string, ContentSource> = {
  strunk_white: {
    id: 'src-strunk-white',
    title: 'The Elements of Style (4th Edition)',
    publisher: 'Pearson / Allyn & Bacon',
    url: 'https://www.bartleby.com/141/',
    licenseNotes: 'Educational Citation / Public Domain excerpts',
    accessedAt: '2026-10-24'
  },
  orwell_politics: {
    id: 'src-orwell',
    title: 'Politics and the English Language (1946)',
    publisher: 'Horizon Magazine / The Orwell Foundation',
    url: 'https://www.orwellfoundation.com/the-orwell-foundation/orwell/essays-and-other-works/politics-and-the-english-language/',
    licenseNotes: 'Public Domain Educational Archive',
    accessedAt: '2026-10-24'
  },
  kahneman_tfas: {
    id: 'src-kahneman',
    title: 'Thinking, Fast and Slow (System 1 & System 2)',
    publisher: 'Farrar, Straus and Giroux',
    url: 'https://en.wikipedia.org/wiki/Thinking,_Fast_and_Slow',
    licenseNotes: 'Scholarly Reference',
    accessedAt: '2026-10-24'
  },
  ietf_rfc: {
    id: 'src-ietf-rfc',
    title: 'RFC 9110: HTTP Semantics & RFC 1035: Domain Names',
    publisher: 'Internet Engineering Task Force (IETF)',
    url: 'https://www.rfc-editor.org/rfc/rfc9110',
    licenseNotes: 'Open Standard Specification',
    accessedAt: '2026-10-24'
  }
};

export const MOCK_TOPICS: Topic[] = [
  {
    id: 'topic-english',
    slug: 'english-foundations',
    name: 'English Foundations & Nuance',
    description: 'Master clarity, active voice, rhetorical force, and high-impact vocabulary for powerful human expression.',
    category: 'Language & Communication',
    iconName: 'book-open',
    status: 'published',
    lessons: [
      {
        id: 'les-active-voice',
        topicId: 'topic-english',
        slug: 'active-voice-and-impact',
        title: 'Active Voice: The Engine of Kinetic Prose',
        level: 'beginner',
        estMinutes: 8,
        summary: 'Learn how to energize your writing, eliminate ambiguity, and make your sentences hit with immediate impact.',
        position: 1,
        status: 'published',
        version: 1,
        sources: [MOCK_SOURCES.strunk_white],
        quizId: 'quiz-active-voice',
        sections: [
          {
            id: 'sec-av-1',
            position: 1,
            heading: 'The Actor Leads: Anatomy of Kinetic Sentences',
            bodyStandard: `Every sentence relates an action. In the active voice, the grammatical subject is the actor—the entity physically or logically executing the verb.

Compare these two statements:
• Active: "The engineer repaired the transatlantic fiber cable." (Actor -> Verb -> Target)
• Passive: "The transatlantic fiber cable was repaired by the engineer."

In the active sentence, narrative momentum moves forward. It is direct, concise, and leaves zero doubt about responsibility. In contrast, the passive sentence forces the reader to hold the object in suspense before finding out who performed the act.`,
            bodyAnalogy: `Think of a cinematographer filming a soccer goal. Active voice trains the spotlight right on the striker as their boot connects with the ball. Passive voice shows the net vibrating and the ball sitting on the grass, only mentioning the striker as an afterthought in a voiceover.`,
            bodyAdvanced: `Linguistic discourse analysis shows that active clauses minimize working-memory load during semantic parsing. Because the grammatical subject aligns with the semantic "Agent" (Theta-role assignment in generative syntax), comprehension speed increases by 20–30% in psycholinguistic eye-tracking experiments.`,
            keyTakeaway: 'Lead with the actor doing the action whenever clarity, pace, and vigor are your goals.'
          },
          {
            id: 'sec-av-2',
            position: 2,
            heading: 'When Passive Voice is Deliberately Superior',
            bodyStandard: `A common myth is that passive voice should be eradicated. In truth, seasoned stylists employ passive voice deliberately under three legitimate circumstances:

1. When the actor is genuinely unknown or irrelevant: "The ancient gold coin was minted around 320 BCE."
2. When the receiver of the action is the rightful headline: "Three new hospitals were opened in rural counties today."
3. Diplomatic de-escalation: "An error was made in the calculation," shifting focus to solving the problem rather than assigning personal blame.`,
            bodyAnalogy: `Imagine a hospital press release. If an endangered patient makes a miraculous recovery, the headline reads: "Patient cured of rare illness." The patient is the hero of the headline, not the needle or the syringe.`,
            bodyAdvanced: `In functional grammar (Halliday), passive voice serves as an information packaging mechanism. It thematicizes the patient or outcome into the "Theme" position, leaving the end-focus position open for novel or heavily weighted semantic elements.`,
            keyTakeaway: 'Make active voice your default workhorse, but intentionally switch to passive when the receiver or outcome is the true protagonist.'
          }
        ]
      },
      {
        id: 'les-connotations',
        topicId: 'topic-english',
        slug: 'subtle-connotations-and-tone',
        title: 'Connotations: The Hidden Emotional Gravity of Words',
        level: 'intermediate',
        estMinutes: 11,
        summary: 'Explore how exact synonyms carry wildly divergent emotional subtexts, social weight, and persuasive power.',
        position: 2,
        status: 'published',
        version: 1,
        sources: [MOCK_SOURCES.orwell_politics],
        quizId: 'quiz-connotations',
        sections: [
          {
            id: 'sec-cn-1',
            position: 1,
            heading: 'Denotation vs. Connotation: The Dictionary vs. The Soul',
            bodyStandard: `Denotation is the literal, objective dictionary definition of a word. Connotation is the aura of emotional, cultural, and moral associations a word evokes.

Consider three words with identical denotations ("unwilling to spend money"):
• Frugal (Positive connotation: disciplined, wise, thoughtful)
• Thrifty (Neutral/Warm: practical, resourceful)
• Cheap / Miserly (Negative connotation: greedy, selfish, low-quality)

Selecting the wrong synonym alters how the reader perceives your character and your subject, even if your literal facts are accurate.`,
            bodyAnalogy: `Think of words as musical instruments playing the same note (C-sharp). A classical grand piano, a distorted electric guitar, and a plastic kazoo all sound the exact same pitch, but they project radically different vibes into the room.`,
            bodyAdvanced: `Semantic prosody refers to the habitual collinearity of words with positive or negative evaluations. Words like "cause" carry negative prosody ("cause disease", "cause panic"), whereas "bring about" is evaluatively neutral or positive ("bring about change", "bring about peace").`,
            keyTakeaway: 'Never pick a synonym solely from a thesaurus; audit its emotional temperature and social overtones first.'
          }
        ]
      }
    ]
  },
  {
    id: 'topic-logic',
    slug: 'critical-thinking',
    name: 'Critical Thinking & Mental Models',
    description: 'Detect cognitive biases, dismantle fallacies, weigh probabilities, and reason from first principles.',
    category: 'Logic & Philosophy',
    iconName: 'brain',
    status: 'published',
    lessons: [
      {
        id: 'les-availability-heuristic',
        topicId: 'topic-logic',
        slug: 'availability-heuristic-and-risk',
        title: 'The Availability Heuristic: Why vivid memories fool us',
        level: 'beginner',
        estMinutes: 9,
        summary: 'Understand why humans miscalculate risk based on how easily dramatic examples come to mind.',
        position: 1,
        status: 'published',
        version: 1,
        sources: [MOCK_SOURCES.kahneman_tfas],
        quizId: 'quiz-availability',
        sections: [
          {
            id: 'sec-ah-1',
            position: 1,
            heading: 'Ease of Recall as a Flawed Proxy for Probability',
            bodyStandard: `Pioneered by psychologists Amos Tversky and Daniel Kahneman, the availability heuristic describes our mental shortcut of assessing how likely an event is based on how easily instances of it can be retrieved from memory.

If news media airs days of sensational coverage following a commercial airplane crash, millions of people suddenly fear flying—even though statistical odds of death in a commercial flight are roughly 1 in 11 million, compared to 1 in 100 for motor vehicles. Because the plane crash is vivid and emotionally salient, our brains treat it as frequent.`,
            bodyAnalogy: `Imagine an untidy desk where papers on top are easy to grab, while older, thicker binders are tucked away in a cabinet. You keep reading the top paper because it is physically accessible, not because it contains the most important truth.`,
            bodyAdvanced: `Neurologically, System 1 cognitive processing relies on salience, affect, and associative fluency. When retrieval fluency is high, the amygdala and anterior cingulate cortex reinforce subjective certainty before System 2 can mobilize probabilistic counter-evidence.`,
            keyTakeaway: 'Emotional vividness is not statistical frequency. When making high-stakes decisions, consult base rates instead of memory.'
          }
        ]
      }
    ]
  },
  {
    id: 'topic-tech',
    slug: 'how-the-internet-works',
    name: 'How the Internet & Networks Work',
    description: 'Demystify packets, IP routing, DNS resolution, HTTP protocols, and the physical backbone of cyberspace.',
    category: 'Technology & Systems',
    iconName: 'globe',
    status: 'published',
    lessons: [
      {
        id: 'les-packet-switching',
        topicId: 'topic-tech',
        slug: 'packet-switching-and-routing',
        title: 'Packet Switching: The Invisible Postal Service of Data',
        level: 'intermediate',
        estMinutes: 10,
        summary: 'Discover how movies, messages, and calls are chopped into billions of tiny envelopes and reassembled instantaneously.',
        position: 1,
        status: 'published',
        version: 1,
        sources: [MOCK_SOURCES.ietf_rfc],
        quizId: 'quiz-packets',
        sections: [
          {
            id: 'sec-ps-1',
            position: 1,
            heading: 'Why We Chop Files: Circuit vs. Packet Switching',
            bodyStandard: `Early telephone networks used "circuit switching": when Alice called Bob, physical copper wires clicked together, reserving a dedicated path. If nobody spoke, the wire sat completely idle.

The modern internet uses "packet switching". Every photograph, song, or webpage is sliced into tiny chunks called packets (usually up to 1,500 bytes). Each packet receives a header with the sender IP, receiver IP, and sequence number. Packets travel independently across multiple routers and take different paths before the recipient reassembles them.`,
            bodyAnalogy: `Imagine mailing a 1,000-page book to a friend. Instead of renting a private freight truck, you tear out each page, put it in a separate stamped envelope with page numbers ("Page 14 of 1,000"), and drop them in normal mailboxes. Some envelopes travel by train, some by air, but your friend puts them in order when they arrive.`,
            bodyAdvanced: `At Layer 3 (Network Layer) of the OSI model, Internet Protocol (IPv4/IPv6) delivers best-effort datagrams. The Transmission Control Protocol (TCP) at Layer 4 provides connection-oriented reliability via SYN-ACK handshakes, windowing, and selective acknowledgment (SACK) for packet retransmission.`,
            keyTakeaway: 'Packet switching makes the global internet resilient: if one router fails, packets dynamically reroute around the outage.'
          }
        ]
      }
    ]
  }
];

// Private Server Quiz Store (with protected answer keys and explanations)
export const SERVER_QUIZ_STORE: Record<string, {
  id: string;
  lessonId: string;
  title: string;
  passThresholdPercent: number;
  questions: ServerQuestion[];
}> = {
  'quiz-active-voice': {
    id: 'quiz-active-voice',
    lessonId: 'les-active-voice',
    title: 'Active Voice Mastery & Sentence Force',
    passThresholdPercent: 70,
    questions: [
      {
        id: 'q-av-1',
        position: 1,
        type: 'multiple_choice',
        prompt: 'Which sentence is written in the ACTIVE voice?',
        options: [
          { id: 'opt-a', text: 'The security vulnerability was patched by our lead engineer at midnight.' },
          { id: 'opt-b', text: 'Our lead engineer patched the security vulnerability at midnight.' },
          { id: 'opt-c', text: 'A patch was deployed to production systems by automated scripts.' },
          { id: 'opt-d', text: 'The network downtime was caused by an unexpected fiber cut.' }
        ],
        correctOptionId: 'opt-b',
        explanation: 'Option B places the actor ("Our lead engineer") at the start as the subject executing the verb ("patched"). The other options bury the actor behind prepositions or omit it entirely.'
      },
      {
        id: 'q-av-2',
        position: 2,
        type: 'multiple_choice',
        prompt: 'In which scenario is the PASSIVE voice the most appropriate editorial choice?',
        options: [
          { id: 'opt-a', text: 'When writing a fast-paced thriller scene where a spy dashes across rooftops.' },
          { id: 'opt-b', text: 'When writing a sales call-to-action urging an individual to sign up.' },
          { id: 'opt-c', text: 'In an archaeological report where the creator is unknown: "The clay vase was sculpted in 800 BCE."' },
          { id: 'opt-d', text: 'When coaching a team and declaring who must tackle the defense.' }
        ],
        correctOptionId: 'opt-c',
        explanation: 'When the actor is genuinely unknown or lost to history, passive voice accurately reflects the informational reality without inventing clumsy filler subjects.'
      },
      {
        id: 'q-av-3',
        position: 3,
        type: 'multiple_choice',
        prompt: 'Why does active voice generally increase reading speed in psycholinguistic tests?',
        options: [
          { id: 'opt-a', text: 'Because active sentences contain fewer syllables on average.' },
          { id: 'opt-b', text: 'Because it aligns the grammatical subject directly with the semantic actor (Agent).' },
          { id: 'opt-c', text: 'Because active voice avoids the use of past tense verbs.' },
          { id: 'opt-d', text: 'Because passive voice is grammatically illegal in formal publications.' }
        ],
        correctOptionId: 'opt-b',
        explanation: 'Syntactic parsing requires less cognitive working memory when the subject doing the action arrives before the verb and recipient.'
      }
    ]
  },
  'quiz-connotations': {
    id: 'quiz-connotations',
    lessonId: 'les-connotations',
    title: 'Word Choice & Connotative Gravity',
    passThresholdPercent: 70,
    questions: [
      {
        id: 'q-cn-1',
        position: 1,
        type: 'multiple_choice',
        prompt: 'Which word has a positive connotation for someone who is deliberate with spending?',
        options: [
          { id: 'opt-a', text: 'Cheap' },
          { id: 'opt-b', text: 'Frugal' },
          { id: 'opt-c', text: 'Miserly' },
          { id: 'opt-d', text: 'Tight-fisted' }
        ],
        correctOptionId: 'opt-b',
        explanation: '"Frugal" carries associations of prudence, wisdom, and resourcefulness, while "cheap" and "miserly" carry negative social judgment.'
      },
      {
        id: 'q-cn-2',
        position: 2,
        type: 'multiple_choice',
        prompt: 'What is the key difference between denotation and connotation?',
        options: [
          { id: 'opt-a', text: 'Denotation is British English; connotation is American English.' },
          { id: 'opt-b', text: 'Denotation is the literal definition; connotation is the emotional/cultural nuance.' },
          { id: 'opt-c', text: 'Denotation applies only to nouns; connotation applies to adjectives.' },
          { id: 'opt-d', text: 'There is no difference; they are interchangeable terms.' }
        ],
        correctOptionId: 'opt-b',
        explanation: 'Denotation provides the objective dictionary meaning, whereas connotation provides the secondary emotional and cultural resonance.'
      }
    ]
  },
  'quiz-availability': {
    id: 'quiz-availability',
    lessonId: 'les-availability-heuristic',
    title: 'Availability Bias & Risk Cognition',
    passThresholdPercent: 70,
    questions: [
      {
        id: 'q-ah-1',
        position: 1,
        type: 'multiple_choice',
        prompt: 'The availability heuristic causes people to overestimate risk when an event is:',
        options: [
          { id: 'opt-a', text: 'Statistically documented in complex actuarial tables.' },
          { id: 'opt-b', text: 'Emotionally dramatic, vivid, and easily recalled in memory.' },
          { id: 'opt-c', text: 'Scientifically proven to have a 0.001% probability.' },
          { id: 'opt-d', text: 'Taught exclusively in graduate university courses.' }
        ],
        correctOptionId: 'opt-b',
        explanation: 'Human memory uses cognitive fluency as a proxy for frequency. Vivid, media-saturated events like plane crashes feel frequent because they are effortless to recall.'
      }
    ]
  },
  'quiz-packets': {
    id: 'quiz-packets',
    lessonId: 'les-packet-switching',
    title: 'Packet Switching Fundamentals',
    passThresholdPercent: 70,
    questions: [
      {
        id: 'q-pk-1',
        position: 1,
        type: 'multiple_choice',
        prompt: 'What was the major downside of early "circuit switching" telephone networks?',
        options: [
          { id: 'opt-a', text: 'Dedicated physical lines sat idle when participants paused or stayed silent.' },
          { id: 'opt-b', text: 'Packets were constantly lost and retransmitted.' },
          { id: 'opt-c', text: 'Audio quality was too compressed to understand human speech.' },
          { id: 'opt-d', text: 'It required computers with high-speed microprocessors.' }
        ],
        correctOptionId: 'opt-a',
        explanation: 'Circuit switching locked an entire physical copper wire for the duration of the call, preventing other callers from utilizing that bandwidth even during silence.'
      }
    ]
  }
};
