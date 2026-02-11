const Song = require("../models/Song");

async function seedSampleSongs() {
  const count = await Song.countDocuments();
  if (count > 0) {
    return;
  }

  await Song.create([
    {
      title: "Arise and Sing",
      artist: "Arise Worship Collective",
      primaryLanguage: "english",
      categories: ["worship", "praise"],
      difficulty: "mixed",
      lyricVariants: [
        {
          language: "english",
          script: "original",
          body: `Verse 1
Arise and sing, lift your voice
To the King who reigns above
In His presence we rejoice
In His never-ending love

Chorus
Hallelujah, praise His name
Hallelujah, He is worthy
Hallelujah, we proclaim
Jesus Christ, our Lord and King

Verse 2
From the depths we cry to You
You have heard our every prayer
In Your mercy, make us new
In Your grace, we find our rest`,
        },
      ],
      chordSets: [
        {
          difficulty: "easy",
          key: "C",
          body: `Verse 1
C              F              G
Arise and sing, lift your voice
C              F              G
To the King who reigns above
Am             F              C              G
In His presence we rejoice
Am             F              C              G
In His never-ending love

Chorus
F              G              C
Hallelujah, praise His name
F              G              C
Hallelujah, He is worthy
F              G              C              G
Hallelujah, we proclaim
F              G              C
Jesus Christ, our Lord and King`,
        },
        {
          difficulty: "advanced",
          key: "C",
          body: `Verse 1
Cmaj7         Fmaj7          Gsus4         G
Arise and sing, lift your voice
Cmaj7         Fmaj7          Gsus4         G
To the King who reigns above
Am7           Fmaj7          Cmaj7         Gsus4
In His presence we rejoice
Am7           Fmaj7          Cmaj7         Gsus4
In His never-ending love

Chorus
Fmaj7         Gsus4          Cmaj7
Hallelujah, praise His name
Fmaj7         Gsus4          Cmaj7
Hallelujah, He is worthy
Fmaj7         Gsus4          Cmaj7         Gsus4
Hallelujah, we proclaim
Fmaj7         Gsus4          Cmaj7
Jesus Christ, our Lord and King`,
        },
      ],
      isTamilWithTanglish: false,
    },
    {
      title: "Uyirtharum Yesu",
      artist: "Arise Worship Collective",
      primaryLanguage: "tamil",
      categories: ["worship", "slow"],
      difficulty: "mixed",
      isTamilWithTanglish: true,
      lyricVariants: [
        {
          language: "tamil",
          script: "original",
          body: `வசனம் 1
உயிர்தரும் ஏசு நீயே
என் வாழ்வின் நாயகனே
உன் அன்பில் நான் வாழ்கிறேன்
என்றென்றும் உன்னோடே

சரணம்
ஆலெலூயா, உன்னைத் துதிக்கிறேன்
ஆலெலூயா, நீயே மகிமை
ஆலெலூயா, உன்னைப் போற்றுகிறேன்
என் இயேசு, என் கர்த்தா

வசனம் 2
என் இதயம் உன்னைத் தேடும்
உன் சமூகம் என் ஆசை
உன் வார்த்தை என் வழிகாட்டி
உன் ஆவியில் நான் வாழ்கிறேன்`,
        },
        {
          language: "tamil",
          script: "transliteration",
          body: `Vasanam 1
Uyirtharum Yesu neeye
En vaazhvin naayagane
Un anbil naan vaazhgiren
Endrendrum unnode

Saranam
Alleluya, unnai thudikkiren
Alleluya, neeye magimai
Alleluya, unnai potrugiren
En Yesu, en kartha

Vasanam 2
En idhayam unnai thedum
Un samugam en aasai
Un varthai en vazhigatti
Un aaviyil naan vaazhgiren`,
        },
      ],
      chordSets: [
        {
          difficulty: "easy",
          key: "G",
          body: `Vasanam 1
G              C              D
Uyirtharum Yesu neeye
G              C              D
En vaazhvin naayagane
Em             C              G              D
Un anbil naan vaazhgiren
Em             C              G              D
Endrendrum unnode

Saranam
C              D              G
Alleluya, unnai thudikkiren
C              D              G
Alleluya, neeye magimai
C              D              G              D
Alleluya, unnai potrugiren
C              D              G
En Yesu, en kartha`,
        },
        {
          difficulty: "advanced",
          key: "G",
          body: `Vasanam 1
Gmaj7         Cmaj7          Dsus4         D
Uyirtharum Yesu neeye
Gmaj7         Cmaj7          Dsus4         D
En vaazhvin naayagane
Em7          Cmaj7          Gmaj7         Dsus4
Un anbil naan vaazhgiren
Em7          Cmaj7          Gmaj7         Dsus4
Endrendrum unnode

Saranam
Cmaj7         Dsus4          Gmaj7
Alleluya, unnai thudikkiren
Cmaj7         Dsus4          Gmaj7
Alleluya, neeye magimai
Cmaj7         Dsus4          Gmaj7         Dsus4
Alleluya, unnai potrugiren
Cmaj7         Dsus4          Gmaj7
En Yesu, en kartha`,
        },
      ],
    },
    {
      title: "Namma Devara",
      artist: "Arise Worship Collective",
      primaryLanguage: "kannada",
      categories: ["worship", "praise"],
      difficulty: "easy",
      lyricVariants: [
        {
          language: "kannada",
          script: "original",
          body: `ವಚನ 1
ನಮ್ಮ ದೇವರಾ, ನೀನೇ ಮಹಾನ್
ನಿನ್ನ ಸ್ತುತಿಯಲ್ಲಿ ನಾವು ನಿಲ್ಲುತ್ತೇವೆ
ನಿನ್ನ ಪ್ರೀತಿಯಲ್ಲಿ ನಾವು ವಾಸಿಸುತ್ತೇವೆ
ನೀನೇ ನಮ್ಮ ರಕ್ಷಕ

ಸ್ತುತಿ
ಹಲ್ಲೆಲೂಯ್ಯ, ನಿನ್ನನ್ನು ಸ್ತುತಿಸುತ್ತೇವೆ
ಹಲ್ಲೆಲೂಯ್ಯ, ನೀನೇ ಮಹಿಮೆ
ಹಲ್ಲೆಲೂಯ್ಯ, ನಿನ್ನನ್ನು ಗೌರವಿಸುತ್ತೇವೆ
ಯೇಸು ಕ್ರಿಸ್ತ, ನಮ್ಮ ಕರ್ತ`,
        },
      ],
      chordSets: [
        {
          difficulty: "easy",
          key: "D",
          body: `Vachana 1
D              G              A
Namma devara, neene mahan
D              G              A
Ninnastutiyalli navu nillutteve
Bm             G              D              A
Ninnapreetiyalli navu vasisutteve
Bm             G              D              A
Neene namma rakshaka

Stuti
G              A              D
Halleluya, ninnannu stutisutteve
G              A              D
Halleluya, neene mahime
G              A              D              A
Halleluya, ninnannu gauravisutteve
G              A              D
Yesu Krista, namma kartha`,
        },
      ],
      isTamilWithTanglish: false,
    },
  ]);
}

module.exports = { seedSampleSongs };



