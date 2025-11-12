# Musical Ear Training Web App - Project Specification

## Overview
A web-based musical ear training application with multiple training modes, built with React + TypeScript + Tone.js, deployable to GitHub Pages.

## Technical Stack
- **Framework**: React with TypeScript
- **Audio Library**: Tone.js
- **Deployment**: GitHub Pages (static site)
- **Storage**: localStorage for lifetime statistics
- **Build Tool**: Vite or Create React App (to be decided during implementation)

## Application Flow
1. **Main Menu** - Displays all available training modes as buttons
2. **Mode Configuration Screen** - User configures settings for selected mode
3. **Question Loop** - User answers questions based on audio prompts
4. **Stats Screen** - Shows session results and lifetime statistics
5. **Return to Main Menu**

## Training Modes

### 1. Chord Type Training
User hears a chord and identifies its type.

**Available chord types (selectable via checkboxes):**
- Major
- Minor
- Dominant 7th
- Major 7th
- Minor 7th
- 9th chords (types TBD during implementation)
- Additional types can be added

**Constraint**: User must select at least 2 chord types (otherwise trivial)

### 2. Interval Training
User hears two notes and identifies the interval between them.

**Configuration options:**
- **Interval types (checkboxes)**: Minor 2nd, Major 2nd, Minor 3rd, Major 3rd, Perfect 4th, Tritone, Perfect 5th, Minor 6th, Major 6th, Minor 7th, Major 7th, Octave
- **Octave range**: Setting to define note range (exact implementation TBD)
- **Direction**: Random / Ascending / Descending
- **Harmonic mode**: Checkbox option to play both notes simultaneously
- **Compound intervals**: Setting to include intervals beyond one octave (9th, 10th, etc.)

**Constraint**: User must select at least 2 interval types

### 3. Chord Progression Training
User hears a chord progression and identifies it using Roman numeral notation.

**Configuration options:**
- **Difficulty**:
  - Easy: 2-4 chords per progression
  - Hard: 5-8 chords per progression
- **Chord pool**:
  - Diatonic only
  - Non-diatonic only
  - Both (separate checkboxes)
- **Key**: Dropdown selector
  - Random (different key each question)
  - Specific keys (C, D, E, F, G, A, B with major/minor variants)
- **BPM**: Random within reasonable range (e.g., 80-120 BPM)

**Diatonic chords:**
- Major keys: I, ii, iii, IV, V, vi, vii°
- Minor keys: i, ii°, III, iv, v, VI, VII

**Non-diatonic chords:**
- Everything not directly part of the scale (borrowed chords, secondary dominants, altered chords, etc.)
- Specific list to be determined during implementation

**Note**: The program provides the key to the user before playing the progression

## Universal Features (All Modes)

### Question Interface
- **Replay button**: Allows user to hear the audio again
- **Instrument selector**: Toggle between Piano and Guitar sound (per question)
- **Answer input**: Depends on mode (buttons, dropdown, or text input)
- **"I Give Up" button**: Reveals correct answer without counting toward stats
- **Feedback**: Simple Correct/Incorrect indication

### Session Configuration
- **Number of questions**: User-selectable (e.g., 10, 20, 30, 50)
- **Guest mode**: Option to play without saving to lifetime statistics
- **Settings persistence**: Mode settings reset to defaults after each session ends

### Statistics
- **Per-session stats**: Accuracy rate shown at end of each session
- **Lifetime stats**: Stored in localStorage, tracked separately per mode:
  - Chord Type Training accuracy
  - Interval Training accuracy  
  - Chord Progression Training accuracy
- **Stats viewing**: Accessible from Stats Screen after session completion

## UI/UX Design Philosophy
- **Minimalistic yet modern** aesthetic
- **Single-screen approach**: Only one screen visible at a time (Main Menu, Configuration, Question, or Stats)
- **No split views**: User shouldn't see multiple "sections" simultaneously
- **Clean navigation**: Clear flow between screens

## Audio Implementation Notes
- Use Tone.js for all sound generation
- Support both piano and guitar timbres
- Octave range configuration per mode (specific ranges TBD)
- BPM randomization for chord progressions within reasonable bounds
- Ensure audio playback works reliably across browsers

## Development Considerations
- **No backend required**: Pure frontend application
- **localStorage schema**: Design data structure for lifetime stats
- **Responsive design**: Should work on desktop and mobile
- **Audio loading**: Consider preloading samples if using sampled instruments
- **Browser compatibility**: Test Web Audio API support

## Future Enhancement Ideas (Not MVP)
- More chord types (augmented, diminished 7th, sus chords, etc.)
- Melodic dictation mode
- Rhythm training
- User accounts with cloud sync (would require backend)
- Customizable color themes
- Export stats as CSV

## Open Questions for Implementation Phase
1. Specific BPM range for chord progressions (suggested: 80-120)
2. Exact octave ranges for each mode
3. Specific non-diatonic chords to include
4. Exact 9th chord variations to support
5. Default number of questions per session
6. Visual design mockups/wireframes
7. Whether to use Vite or CRA for scaffolding
8. Tone.js sampled instruments vs synthesized sounds

## Next Steps
1. Set up React + TypeScript project with chosen build tool
2. Install and configure Tone.js
3. Create basic routing/screen management system
4. Implement Main Menu UI
5. Build one complete mode end-to-end (suggest starting with Chord Type Training as it's simplest)
6. Expand to other modes
7. Implement statistics tracking
8. Polish UI/UX
9. Test across browsers
10. Deploy to GitHub Pages

---

**Note**: This specification represents the complete requirements discussed. All settings within a mode should reset to defaults after the session ends. The user should have full control over training parameters while maintaining a clean, focused interface.