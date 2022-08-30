const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    uuid = require('uuid'),
    path = require('path'),
    morgan = require('morgan');

app.use(morgan('common'));
app.use(bodyParser.json());

// In-memory arrays to test with
let users = [
    {
        id: 1,
        name: "Luca",
        favoriteMovies: []
    },
    {
        id: 2,
        name: "Connor",
        favoriteMovies: ["Saving Face"]
    }
]
let movies = [
    {
        "Title":"But I'm a Cheerleader",
        "Description":"A naive teenager is sent to rehab camp when her straitlaced parents and friends suspect her of being a lesbian.",
        "Genre": {
            "Name":"Comedy",
            "Description":"Comedy is a genre of film in which the main emphasis is on humor"
        },
        "Director": {
            "Name":"Jamie Rabbit",
             "Bio":"Jamie Babbit was born on November 16, 1970 in Shaker Heights, Ohio, USA. She is a director and producer, known for But I'm a Cheerleader (1999), Silicon Valley (2014) and Girls (2012). She was previously married to Karey Dornetto.",
             "Birth":"November 16, 1970"
        },
        "ImageUrl":"https://m.media-amazon.com/images/M/MV5BNmZjNGVmYmItZWFmNi00ODQ1LThmZTUtMzYzMGJlMjZjMGFiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg",
        "Featured": false
    },
    {
        "Title":"Portrait of a Lady on Fire",
        "Description":"On an isolated island in Brittany at the end of the eighteenth century, a female painter is obliged to paint a wedding portrait of a young woman.",
        "Genre": {
            "Name":"Drama",
            "Description":"drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone."
        },
        "Director": {
            "Name":"Celine Sciamma",
             "Bio":"Céline Sciamma was born on November 12, 1978 in Pontoise, Val-d'Oise, France. She is a writer and director, known for Portrait of a Lady on Fire (2019), Tomboy (2011) and Water Lilies (2007).",
             "Birth":"November 12, 1978"
        },
        "ImageUrl":"https://m.media-amazon.com/images/M/MV5BNjgwNjkwOWYtYmM3My00NzI1LTk5OGItYWY0OTMyZTY4OTg2XkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg",
        "Featured": false
    },
    {
        "Title":"Saving Face",
        "Description":"A gay Chinese-American and her traditionalist mother are reluctant to go public with secret loves that clash against cultural expectations.",
        "Genre": {
            "Name":"Comedy",
            "Description":"Comedy is a genre of film in which the main emphasis is on humor"
        },
        "Director": {
            "Name":"Alice Wu",
             "Bio":"Studied computer science at MIT and Stanford University, where she received her bachelors and masters degrees. Left a job designing software at Microsoft to write and direct her first film, Saving Face, which premiered at the Toronto and Sundance Film Festivals, where it was acquired and released by Sony Pictures Classics.",
             "Birth":"April 21, 1970"
        },
        "ImageUrl":"https://m.media-amazon.com/images/M/MV5BZWMzM2JlOTgtNzE3MC00OTI3LTlmMTEtMmE5NDIzOGIxNDliXkEyXkFqcGdeQXVyMTMxMTY0OTQ@._V1_.jpg",
        "Featured": false
    }
    
]

// Homepage - in process
app.get('/', (req, res) => {
    res.send('Welcome to the myFlix app!');
});

// Allow new users to register
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(200).json(newUser)
    } else {
        res.status(400).send('users need names');
    }
})

// Allow users to update their user info (username)
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find( user => user.id == id );


    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('no such user');
    }
})

// Allow existing users to deregister (showing only a text that a user email has been removed)
app.delete('/users/:id/', (req, res) => {
    const { id } = req.params;

    let user = users.find( user => user.id == id );


    if (user) {
        users = users.filter( user => user.id != id);
        res.status(200).send(`user ${id} has been deleted`);
    } else {
        res.status(400).send('no such user');
    }
})

// Allow users to add a movie to their list of favorites (showing only a text that a movie has been added)
app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find( user => user.id == id );


    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
    } else {
        res.status(400).send('no such user');
    }
})

// Allow users to remove a movie from their list of favorites (showing only a text that a movie has been removed
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find( user => user.id == id );


    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
    } else {
        res.status(400).send('no such user');
    }
})

// Return a list of ALL movies to the user
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
})

// Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find(movie => movie.Title === title);

    if (movie){
        res.status(200).json(movie);
    } else {
        res.status(400).send('no such movie')
    }
})

// Return data about a genre (description) by name/title
app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find(movie => movie.Genre.Name === genreName ).Genre;

    if (genre){
        res.status(200).json(genre);
    } else {
        res.status(400).send('no such genre')
    }
})

// Return data about a director (bio, birth year, death year) by name;
app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find(movie => movie.Director.Name === directorName ).Director;

    if (director){
        res.status(200).json(director);
    } else {
        res.status(400).send('no such director')
    }
})

//Access to documentation and other static files in 'public'
app.use('/public', express.static(path.join(__dirname, 'public')));

//Catch-all error function for anything missed
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});