import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Structural analysis of BWV 1042 mvt. I (Allegro), transcribed from the
 * project's own timestamp file. `t` is the segment's start time in
 * seconds — this becomes a SyncPoint anchor. `expert` is close to the
 * original analytical language (tutti/solo, ritornello phrase structure);
 * `layman` is a plain-language rewrite of the same moment, since the two
 * tracks need to describe the same music without sharing vocabulary.
 *
 * Timestamps and structural labels (section/part/phrase) are drawn from
 * the uploaded bwv_1042_timestamps.txt — this is real analytical content,
 * not placeholder text.
 */
const segments: { t: number; expert: string; layman: string }[] = [
  { t: 5, expert: "Tutti: ritornello theme, phrase a.", layman: "The full orchestra opens with the movement's main theme." },
  { t: 13, expert: "Tutti: ritornello theme, phrase b.", layman: "The orchestra continues the opening theme with a new musical idea." },
  { t: 20, expert: "Tutti: ritornello theme, phrase c.", layman: "A third idea in the main theme, still played by the full ensemble." },
  { t: 26, expert: "Tutti: ritornello theme, phrase d.", layman: "The main theme's closing idea, rounding out the opening statement." },
  { t: 34, expert: "Solo: violin enters with elements drawn from phrases a and c.", layman: "The solo violin enters for the first time, echoing bits of the opening theme." },
  { t: 42, expert: "Tutti: ritornello phrase a (gapped version 1 begins).", layman: "The orchestra restates the opening idea, now interleaved with the soloist." },
  { t: 48, expert: "Solo: elements from phrases b and c.", layman: "The violin plays material drawn from the second and third theme ideas." },
  { t: 54, expert: "Tutti: second half of phrase b.", layman: "The orchestra briefly returns with the back half of the second theme." },
  { t: 58, expert: "Solo: elements from phrases b and c.", layman: "The soloist continues developing the same thematic material." },
  { t: 67, expert: "Tutti: phrase b.", layman: "The orchestra restates the second theme idea." },
  { t: 73, expert: "Tutti: phrase c.", layman: "The orchestra restates the third theme idea." },
  { t: 78, expert: "Tutti: first half of phrase d.", layman: "The start of the closing theme returns, played by the orchestra." },
  { t: 81, expert: "Solo: extension of phrase d.", layman: "The violin extends and elaborates on that closing idea." },
  { t: 87, expert: "Tutti: phrase d, then a slight pause.", layman: "The orchestra finishes the closing idea and the music briefly settles." },
  { t: 92, expert: "Tutti: opening of phrase a only (gapped version 2 begins).", layman: "Just the very start of the main theme, played by the orchestra." },
  { t: 95, expert: "Solo: elements from phrases b and c.", layman: "The soloist takes over with material from the second and third ideas." },
  { t: 101, expert: "Tutti: second half of phrase a.", layman: "The orchestra completes the main theme's opening idea." },
  { t: 105, expert: "Solo: elements of phrases b and c.", layman: "The violin continues weaving in the earlier thematic material." },
  { t: 113, expert: "Tutti: phrase b.", layman: "The orchestra restates the second theme idea again." },
  { t: 120, expert: "Tutti: phrase c.", layman: "The orchestra restates the third theme idea again." },
  { t: 126, expert: "Tutti: first half of phrase d.", layman: "The closing idea begins again in the orchestra." },
  { t: 128, expert: "Solo: extension of phrase d.", layman: "The soloist extends the closing idea further." },
  { t: 133, expert: "Tutti: second half of phrase d.", layman: "The orchestra completes the closing idea, ending the exposition." },
  { t: 138, expert: "Solo: elements drawn from phrases b and c (development begins).", layman: "The soloist opens a new, more exploratory section using earlier material." },
  { t: 149, expert: "Solo: harmony-defining tremolos — the first passage in the movement without ritornello thematic material.", layman: "For the first time, the violin plays music that isn't based on the opening theme at all." },
  { t: 181, expert: "Tutti: phrase a (gapped ritornello returns).", layman: "The main theme's opening idea briefly returns in the orchestra." },
  { t: 187, expert: "Solo: elements from phrase b.", layman: "The violin answers with material from the second theme idea." },
  { t: 191, expert: "Tutti: phrase a.", layman: "The orchestra restates the opening idea again." },
  { t: 194, expert: "Solo: elements from phrase b.", layman: "The violin responds again with the second theme idea." },
  { t: 198, expert: "Tutti: phrase a.", layman: "A third, brief return of the opening idea." },
  { t: 203, expert: "Tutti: phrase b.", layman: "The orchestra plays the second theme idea in full." },
  { t: 211, expert: "Solo: brief, embellished elements from phrase c.", layman: "The violin adds a short, decorated variation on the third theme idea." },
  { t: 214, expert: "Solo: harmony-defining motives drawn from phrase c, while violins and cello accompany with phrase a in sequence.", layman: "The soloist explores new material while the rest of the strings quietly repeat the opening theme underneath." },
  { t: 245, expert: "Solo: virtuosic contrapuntal passage — double stops and motives drawn from phrase a.", layman: "The soloist plays a technically demanding passage, sounding two notes at once while echoing the opening theme." },
  { t: 261, expert: "Tutti: extension of phrase c.", layman: "The orchestra develops the third theme idea further." },
  { t: 271, expert: "Solo: an ominous downward descent.", layman: "The violin plays a dark, descending line." },
  { t: 273, expert: "Solo: elements from phrases b and c.", layman: "The soloist returns to material from the second and third theme ideas." },
  { t: 281, expert: "Solo: harmony-defining tremolos.", layman: "The violin plays another passage built on harmony rather than the main theme." },
  { t: 291, expert: "Solo: a descent using elements from phrase c.", layman: "A falling passage drawing on the third theme idea." },
  { t: 298, expert: "Tutti: extension of phrase d (approaching the movement's climax).", layman: "The orchestra builds tension by extending the closing theme idea." },
  { t: 312, expert: "Solo: a climactic ascent and a brief, melancholy cadenza.", layman: "The soloist rises to the emotional peak of the movement, then plays a short, wistful unaccompanied passage." },
  { t: 337, expert: "Tutti: ritornello theme, phrase a (recapitulation begins — a repeat of the exposition).", layman: "The opening theme returns in full, marking the start of the movement's final section." },
  { t: 345, expert: "Tutti: ritornello theme, phrase b.", layman: "The orchestra continues the returning main theme." },
  { t: 352, expert: "Tutti: ritornello theme, phrase c.", layman: "The third idea of the returning main theme." },
  { t: 358, expert: "Tutti: ritornello theme, phrase d.", layman: "The closing idea of the returning main theme." },
  { t: 365, expert: "Solo: elements of phrases a and c.", layman: "The soloist re-enters, echoing the opening and third theme ideas." },
  { t: 373, expert: "Tutti: ritornello phrase a (gapped version 1 returns).", layman: "The main theme's opening idea returns, interleaved with the soloist again." },
  { t: 380, expert: "Solo: elements from phrases b and c.", layman: "The violin plays material from the second and third theme ideas." },
  { t: 386, expert: "Tutti: second half of phrase b.", layman: "The orchestra briefly returns with the back half of the second theme." },
  { t: 389, expert: "Solo: elements from phrases b and c.", layman: "The soloist continues developing the same material." },
  { t: 398, expert: "Tutti: phrase b.", layman: "The orchestra restates the second theme idea." },
  { t: 404, expert: "Tutti: phrase c.", layman: "The orchestra restates the third theme idea." },
  { t: 409, expert: "Tutti: first half of phrase d.", layman: "The closing idea begins again in the orchestra." },
  { t: 412, expert: "Solo: extension of phrase d.", layman: "The violin extends the closing idea." },
  { t: 418, expert: "Tutti: phrase d, then a slight pause.", layman: "The orchestra finishes the closing idea and the music briefly settles again." },
  { t: 423, expert: "Tutti: opening of phrase a only (gapped version 2 returns).", layman: "Just the start of the main theme, played by the orchestra." },
  { t: 425, expert: "Solo: elements from phrases b and c.", layman: "The soloist takes over again with earlier thematic material." },
  { t: 432, expert: "Tutti: second half of phrase a.", layman: "The orchestra completes the main theme's opening idea." },
  { t: 436, expert: "Solo: elements of phrases b and c.", layman: "The violin continues weaving in the earlier material." },
  { t: 444, expert: "Tutti: phrase b.", layman: "The orchestra restates the second theme idea." },
  { t: 451, expert: "Tutti: phrase c.", layman: "The orchestra restates the third theme idea." },
  { t: 458, expert: "Tutti: first half of phrase d.", layman: "The closing idea begins in the orchestra for the final time." },
  { t: 460, expert: "Solo: extension of phrase d.", layman: "The soloist extends the closing idea one last time." },
  { t: 465, expert: "Tutti: second half of phrase d, closing with a flourish from the soloist.", layman: "The orchestra brings the movement to a close, with a final flourish from the violin." },
];

async function main() {
  const piece = await prisma.piece.upsert({
    where: { id: "bwv-1042-i-allegro" },
    update: {},
    create: {
      id: "bwv-1042-i-allegro",
      title: "Violin Concerto in E major, BWV 1042: I. Allegro",
      composer: "Johann Sebastian Bach",
      year: 1720, // composed c. 1717–1723, during Bach's Köthen period
    },
  });

  const recording = await prisma.recording.upsert({
    where: { id: "bwv-1042-hahn-bremen" },
    update: {},
    create: {
      id: "bwv-1042-hahn-bremen",
      pieceId: piece.id,
      performer: "Hilary Hahn (violin) · Deutsche Kammerphilharmonie Bremen · cond. Omer Meir Wellber",
      year: 2020, // YouTube upload date — the actual performance date isn't listed on the video
      provider: "youtube",
      youtubeVideoId: "DgfyryZJES4",
    },
  });

  // A placeholder Score row so SyncPoints have somewhere to point — there's
  // no real MusicXML for this piece yet, so `measureNumber` here is really
  // a sequential segment index, not a true bar number from the score.
  const score = await prisma.score.upsert({
    where: { id: "bwv-1042-placeholder-score" },
    update: {},
    create: {
      id: "bwv-1042-placeholder-score",
      pieceId: piece.id,
      musicXmlUrl: "TODO-no-musicxml-yet",
      measureCount: segments.length,
    },
  });

  for (let i = 0; i < segments.length; i++) {
    const segmentNumber = i + 1; // stand-in for a real measure number
    const { t, expert, layman } = segments[i];

    await prisma.syncPoint.upsert({
      where: {
        recordingId_measureNumber: {
          recordingId: recording.id,
          measureNumber: segmentNumber,
        },
      },
      update: { timestampSec: t, scoreId: score.id },
      create: {
        recordingId: recording.id,
        scoreId: score.id,
        measureNumber: segmentNumber,
        timestampSec: t,
      },
    });

    await prisma.annotation.upsert({
      where: {
        // Annotation has no natural unique key yet, so this relies on
        // findFirst + create semantics instead of a true upsert — fine for
        // a seed script run against an empty table, not safe to re-run
        // blindly against data with manual edits.
        id: `${recording.id}-${segmentNumber}-expert`,
      },
      update: { text: expert },
      create: {
        id: `${recording.id}-${segmentNumber}-expert`,
        recordingId: recording.id,
        measureRangeStart: segmentNumber,
        measureRangeEnd: segmentNumber,
        track: "expert",
        text: expert,
      },
    });

    await prisma.annotation.upsert({
      where: { id: `${recording.id}-${segmentNumber}-layman` },
      update: { text: layman },
      create: {
        id: `${recording.id}-${segmentNumber}-layman`,
        recordingId: recording.id,
        measureRangeStart: segmentNumber,
        measureRangeEnd: segmentNumber,
        track: "layman",
        text: layman,
      },
    });
  }

  console.log(
    `Seeded "${piece.title}" — ${segments.length} sync points, ${segments.length * 2} annotations.`
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
