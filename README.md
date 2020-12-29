# myMDb Back End API

Back end API of myMDb, a site where a user can search for movies, rate a movie, review a movie, manage their watchlist and manage their favourites. Server built in Node and Express. PostgreSQL database. Authentication with Passport Local, Passport Facebook and Passport JWT. Authorization with JSON Web Tokens. Movie data sourced from The Movie Database (TMDb) API.

## Entity Relationship Diagram

![myMDb-ERD](https://user-images.githubusercontent.com/71923215/102818036-c1ddf080-43c8-11eb-87d9-518d66579a2c.png)

## Class Diagram

![myMDb-Class-Diagram](https://user-images.githubusercontent.com/71923215/102818106-e639cd00-43c8-11eb-8cae-963da9acfb3b.png)

## User Stories

```
As a user,
so I can find a movie I'm interested in,
I'd like to be able to search for a particular movie by name.
```

```
As a user,
so I can decide whether I'd like to watch a particular movie,
I'd like to be able see information about that movie.
```

```
As a user,
so I can get a greater sense of whether I'd like to watch a particular movie,
I'd like to be able to see the myMDB rating of that movie.
```

```
As a user,
so I can get an even greater sense of whether I'd like to watch a particular movie,
I'd like to be able to see myMDB reviews of that movie.
```

```
As a user,
so I can gain extra privileges on myMDB,
I'd like to be able to sign up and log in to myMDB.
```

```
As a logged in user,
so I never forget the movie I want to watch,
I'd like to be able to add a movie to my watchlist.
```

```
As a logged in user,
so I can qualitatively express my opinion on a movie I've watched,
I'd like to be able to leave a review of that movie.
```

```
As a logged in user,
so I can quantitatively express my opinion on a movie I've watched,
I'd like to be able to rate a movie out of 10.
```

```
As a logged in user,
so I can remember movies I particularly liked,
I would like to be able to add a movie to my favourites list.
```