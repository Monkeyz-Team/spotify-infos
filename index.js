const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

module.exports = (playlist) => {
  const loadElements = (url) => {
    const xhr = new XMLHttpRequest();
    try {
      xhr.open('GET', url, false);
      xhr.send(null);
    } catch (error) {
      console.log(error);
    }
    return xhr.responseText;
  };

  const htmlText = loadElements(playlist)
  
  if(!htmlText || !htmlText.includes("Spotify")) return console.error('Invalid playlist url')

  const htmlMatch = htmlText.match(/<meta property="music:song"(.*?)\/>/g);
  const musicsLink = []
  htmlMatch.forEach(m => musicsLink.push([...m.matchAll('content="(.*?)"')][0][1]))
  const musics = []

  for (music of musicsLink) {
    const getMusic = loadElements(music);
    musics.push({
      title: [...getMusic.matchAll('<meta property="og:title" content="(.*?)" \/>')][0][1],
      artist: [...getMusic.matchAll('<meta property="og:description" content="(.*?)" \/>')][0][1].match("a song by (.*?) on Spotify")[1],
      image: [...getMusic.matchAll('<meta property="og:image" content="(.*?)" \/>')][0][1],
      preview: [...getMusic.matchAll('<meta property="og:audio" content="(.*?)" \/>')][0][1],
      duration: [...getMusic.matchAll('<meta property="music:duration" content="(.*?)" \/>')][0][1],
      artistUrl: [...getMusic.matchAll('<meta property="music:musician" content="(.*?)" \/>')][0][1],
      releaseDate: [...getMusic.matchAll('<meta property="music:release_date" content="(.*?)" \/>')][0][1]
    })
  }

  return {
    musics,
    musicsLink
  }
}