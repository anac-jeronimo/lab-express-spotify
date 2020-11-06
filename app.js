require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
// Our routes go here:

//Entry point for our app
app.get('/', (req, res) => {
    res.render('index');
})

app.get('/artist-search', (req, res) => {
  let artistName = req.query.artist;    //its req.query because it comes from a form
    spotifyApi
  .searchArtists(artistName)  //beatles, roling stones...  
  .then(data => {
    console.log('The received data from the API: ', data.body);
    let result = data.body.artists.items;
    res.render('artist-search-results', {result: result});

    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
    
})

app.get('/albums/:id', (req, res) => {
  // .getArtistAlbums() code goes here
  spotifyApi
  .getArtistAlbums(req.params.id) //use route params when using a link href
  .then(data => {
  //  console.log('Received Album from the API', data.body.items);
    let searchAlbumsResult = data.body.items;
    res.render('albums', {albums: searchAlbumsResult});
  })
  .catch(err => console.log('Error while retrieving albums', err));
});

app.get('/tracks/:albumId', (req, res) => {
  let albumId = req.params.albumId;   //route params because its a link
  spotifyApi
  .getAlbumTracks(albumId)
  .then(data => {
    //console.log('response from grtAlbumsTracks', data.body);
    res.render('tracks', {tracks: data.body.items});
  })
})



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
