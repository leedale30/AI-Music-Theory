
import type { ContentPart } from './types';

export const bookContent: ContentPart[] = [
  {
    partTitle: 'Part 1: Tones',
    chapters: [
      {
        id: 'part1-ch1',
        title: 'Pitches and Clefs',
        content: [
          { type: 'heading2', text: 'Understanding Musical Tones' },
          { type: 'paragraph', text: 'A tone is a sound that is played or sung at a specific pitch. Pitch describes the frequency or tuning of a tone.' },
          { type: 'notation', data: { abcString: 'X:1\nK:C\nL:1/1\nE F G A | B c d e | f' }, caption: 'The notes of a staff using the treble clef.' },
          { type: 'image', prompt: 'A glowing 3D treble clef floating in a nebula of orange and blue light, cinematic lighting, 8k resolution', caption: 'The symbol of high-pitched melody.' }
        ]
      },
      {
        id: 'part1-ch2',
        title: 'Intervals',
        content: [
           { type: 'heading2', text: 'The Distance Between Notes' },
           { type: 'paragraph', text: 'An interval is the measurement of space between two pitches. The smallest interval is the half-step.' },
           { type: 'notation', data: { abcString: 'X:1\nK:C\n[CE]2 [CF]2 [CG]2' }, caption: 'Major 3rd, Perfect 4th, and Perfect 5th intervals.' }
        ]
      },
      { 
        id: 'part1-ch3', 
        title: 'Scales', 
        content: [
          { type: 'heading2', text: 'The Major Scale' },
          { type: 'paragraph', text: 'The Major scale is the foundation of Western music. It follows the pattern: Whole, Whole, Half, Whole, Whole, Whole, Half.' },
          { type: 'notation', data: { abcString: 'X:1\nK:C\nC D E F G A B c' }, caption: 'The C Major Scale.' },
          { type: 'heading2', text: 'The Natural Minor Scale' },
          { type: 'paragraph', text: 'The minor scale has a more somber, "sad" sound. It starts on the 6th degree of the relative major scale.' },
          { type: 'notation', data: { abcString: 'X:1\nK:Am\nA, B, C D E F G A' }, caption: 'The A Natural Minor Scale.' }
        ] 
      },
      { 
        id: 'part1-ch4', 
        title: 'Major and Minor Keys', 
        content: [
          { type: 'heading2', text: 'Key Signatures' },
          { type: 'paragraph', text: 'Key signatures tell us which notes are consistently sharp or flat throughout a piece.' },
          { type: 'notation', data: { abcString: 'X:1\nK:D\nDEFG ABcd' }, caption: 'The Key of D Major (Two Sharps: F# and C#).' }
        ] 
      }
    ]
  },
  {
    partTitle: 'Part 2: Rhythms',
    chapters: [
      {
        id: 'part2-ch5',
        title: 'Note Values',
        content: [
          { type: 'heading2', text: 'Time Values' },
          { type: 'notation', data: { abcString: 'X:1\nK:C\nC4 | C2 C2 | C C C C | C/C/C/C/ C/C/C/C/' }, caption: 'Whole, Half, Quarter, and Eighth notes.' }
        ]
      },
      { 
        id: 'part2-ch6', 
        title: 'Time Signatures', 
        content: [
          { type: 'heading2', text: 'Simple vs Compound Meter' },
          { type: 'paragraph', text: 'Time signatures determine how many beats are in a measure and which note gets the beat.' },
          { type: 'notation', data: { abcString: 'X:1\nM:3/4\nK:C\nC C C | E E E | G G G | c3' }, caption: 'A simple waltz in 3/4 time.' },
          { type: 'notation', data: { abcString: 'X:1\nM:6/8\nK:C\nC3 E3 | G3 c3' }, caption: 'Compound meter in 6/8 time.' }
        ] 
      },
      { 
        id: 'part2-ch7', 
        title: 'Tempo and Dynamics', 
        content: [
          { type: 'heading2', text: 'Expressive Markings' },
          { type: 'paragraph', text: 'Tempo (speed) and Dynamics (volume) give life to the notes.' },
          { type: 'list', items: ['Piano (p) - Soft', 'Forte (f) - Loud', 'Allegro - Fast', 'Adagio - Slow'] }
        ] 
      }
    ]
  },
  {
    partTitle: 'Part 3: Tunes',
    chapters: [
      { 
        id: 'part3-ch8', 
        title: 'Melodies', 
        content: [
          { type: 'heading2', text: 'Creating a Phrase' },
          { type: 'notation', data: { abcString: 'X:1\nK:G\nG2 GA B2 G2 | A2 AB c2 A2 | B2 Bc d2 B2 | A4 G4' }, caption: 'A simple ascending melody.' }
        ] 
      },
      { 
        id: 'part3-ch9', 
        title: 'Chords', 
        content: [
          { type: 'heading2', text: 'Triads' },
          { type: 'paragraph', text: 'A triad is a 3-note chord built in thirds.' },
          { type: 'notation', data: { abcString: 'X:1\nK:C\n[CEG]4 [DFA]4 [EGB]4' }, caption: 'I, ii, and iii chords in C Major.' }
        ] 
      },
      { 
        id: 'part3-ch10', 
        title: 'Chord Progressions', 
        content: [
          { type: 'heading2', text: 'The I-IV-V-I Progression' },
          { type: 'notation', data: { abcString: 'X:1\nK:C\n[CEG]2 [FAC]2 | [GDB]2 [CEG]2' }, caption: 'The backbone of Western harmony.' }
        ] 
      },
      { 
        id: 'part3-ch11', 
        title: 'Phrases and Form', 
        content: [
          { type: 'heading2', text: 'Binary and Ternary Form' },
          { type: 'paragraph', text: 'Form is the structure of a song (e.g., A-B or A-B-A).' }
        ] 
      }
    ]
  },
  {
    partTitle: 'Part 4: Accompanying',
    chapters: [
      { id: 'part4-ch12', title: 'Ear Training', content: [{ type: 'paragraph', text: 'Learning to identify intervals by ear is crucial.' }] },
      { id: 'part4-ch13', title: 'Accompanying Melodies', content: [{ type: 'notation', data: { abcString: 'X:1\nK:C\nV:1\nE2 F2 G4 |\nV:2\nC,4 G,,4 |' }, caption: 'Simple melody and bass accompaniment.' }] },
      { id: 'part4-ch14', title: 'Transposing', content: [{ type: 'paragraph', text: 'Moving a piece to a different key.' }] }
    ]
  },
  {
    partTitle: 'Part 5: Embellishing',
    chapters: [
      { id: 'part5-ch15', title: 'Harmony', content: [] },
      { id: 'part5-ch16', title: 'Chord Substitutions', content: [] },
      { id: 'part5-ch17', title: 'Special Notation', content: [] }
    ]
  },
  {
    partTitle: 'Part 6: Arranging',
    chapters: [
      { id: 'part6-ch18', title: 'Vocal Writing', content: [] },
      { id: 'part6-ch19', title: 'Lead Sheets', content: [] },
      { 
        id: 'part6-ch20', 
        title: 'The Final Piece', 
        content: [
          { type: 'heading2', text: 'Putting it all Together' },
          { type: 'notation', data: { abcString: 'X:1\nK:C\n"C"G2 G2 "F"A2 A2 | "G"B2 B2 "C"c4 | "C"e2 e2 "F"f2 f2 | "G"g2 g2 "C"c4' }, caption: 'A complete harmonized phrase.' }
        ] 
      }
    ]
  }
];
