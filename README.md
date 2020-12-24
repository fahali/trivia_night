[![title banner](https://i.imgur.com/cC9KC9i.png)](https://fahali.github.io/trivia_night)

# Trivia Night

A trivia game featuring questions from the [Open Trivia Database API](https://opentdb.com/api_config.php). If the images don't work, you can access the live version of the game here:

- https://fahali.github.io/trivia_night

No installs are necessary, just visit the webpage and enjoy the game! (Please excuse any visual glitches or bugs as the project is still a work in progress)

## Screenshots
[![options menu](https://i.imgur.com/aiKlV36.png)](https://fahali.github.io/trivia_night)
[![gameplay](https://i.imgur.com/kKtYZW7.png)](https://fahali.github.io/trivia_night)

## Technologies Used

This project is written in HTML, CSS, and vanilla Javascript. One of the stretch goals (the last one, actually), is to re-write the Javascript using jQuery, just as a personal challenge to help me learn the technology.

The project is hosted via GitHub Pages, served directly from my public repo.

Features and issue tracking / management is handled with Trello. Check out my progress [here](https://trello.com/b/LL1B6SMi/trivia-night-seir-p1).

## Interesting challenges

One issue that became apparent right away was encoding issues. If the questions or answers being served had special characters, those characters would be returned encoded with HTML entities. I had a really hard time getting those entities to render properly without resorting to hacky methods like using the `.innerHTML` properties of `HTMLElement` objects. The first solution was to use `base64` encoding, but that brought about its own headaches. It seemed like with `base64`, I was running into Unicode character issues. Luckily the API can also serve the information encoded as a URI (established with [RFC 3986](https://www.ietf.org/rfc/rfc3986.txt)), which ultimately ended up being the solution I needed. Shoutout to the Welsh town of [Llanfairpwllgwyngyll](https://en.wikipedia.org/wiki/Llanfairpwllgwyngyll) for helping me debug this issue.

The code seemed to grow exponentially in size as more and more features were being added. I practice DRY principles, but a lot of time was spent on bug fixing and refactoring. I had to shuffle around priorities on certain tasks due to how bugs started appearing as the code got more complex.  

## Incomplete

I just started using the `window.localStorage` object to store data. This can be used instead of cookies to save scores, preferences, etc. Due to time constraints I did not implement all of the features using persistent storage.

My original idea of streaming audio from a Youtube video link got shut down pretty quickly as I learned it's technically against their ToS. There is a Javascript library out there that can do that though... I didn't feel comfortable integrating it into my project.

## Timeframe

| Task                                   | Priority | Estimated Time | Time Invested | Actual Time |
| -------------------------------------- | :------: | :------------: | :-----------: | :---------: |
| Setup: GitHub Pages, Trello, README.md |    H     |     2 hrs      |     1 hrs     |    1 hrs    |
| Basic game loop                        |    H     |     4 hrs      |     3 hrs     |    3 hrs    |
| Basic styling                          |    H     |     4 hrs      |     3 hrs     |    3 hrs    |
| Bug fixing / refactoring               |    H     |     8 hrs      |   18.5 hrs    |  18.5 hrs   |
| Advanced API features                  |    M     |     4 hrs      |     9 hrs     |    9 hrs    |
| Timed scoring                          |    M     |     4 hrs      |     6 hrs     |    6 hrs    |
| Advanced Styling                       |    M     |     8 hrs      |    2.5 hrs    |   2.5 hrs   |
| Save user session / prefs via cookies  |    L     |     4 hrs      |     4 hrs     |    4 hrs    |
| Responsive design                      |    L     |     8 hrs      |     X hrs     |    X hrs    |
| Quick Game mode                        |    M     |     2 hrs      |     X hrs     |    X hrs    |
| Elevator music                         |    L     |     4 hrs      |     X hrs     |    X hrs    |
| Light/dark theme                       |    L     |     8 hrs      |     X hrs     |    X hrs    |
| jQuery re-write                        |    L     |     8 hrs      |     X hrs     |    X hrs    |
| Total                                  |    X     |     68 hrs     |    47 hrs     |   47 hrs    |

## Project Schedule

| Day    | Deliverable                                              | Status      |
| ------ | -------------------------------------------------------- | ----------- |
| Dec 17 | Setup / Basic logic / Basic styling                      | complete    |
| Dec 18 | Advanced API features / Timed scoring / Advanced styling | complete    |
| Dec 19 | Integrate cookies and user session / Quick Game mode     | in progress |
| Dec 20 | Responsive design / Light/dark theme                     | incomplete  |
| Dec 21 | Elevator music / jQuery re-write                         | incomplete  |
| Dec 22 | Last touches / Polishing up                              | complete    |
| Dec 23 | Presentations                                            |

## User Stories

### MVP Goals

-  As a player, I want the game to serve me fresh trivia questions that I can answer.
-  As a player, I want the game to keep track of my correct and incorrect answers.
-  As a player, I want the game to present my final score after the questions.
-  As a player, I want the ability to play a new game
-  As a designer, I want the game to look aesthetically pleasing

### Stretch Goals

-  As a player, I want to choose the category of questions.
-  As a player, I want to increase and/or decrease the difficulty of the questions.
-  As a player, I want my score to reflect my speed in answering the questions.
-  As a designer, I want a visible indication of the time remaining for each question
-  As a player, I want a quick game option that will randomly choose a category and difficulty

### Platinum level Goals

-  As a designer, I want the ability to toggle nice elevator music to play in the background conducive to thinking about trivia questions
-  As a player, I want my scores to be saved in my browser session so I can go back and look at them
-  As a designer, I want to choose a light or dark color theme for the trivia game
- As a designer, I want to make my website responsive.
-  As a software engineer, I want to use jQuery (this might require large portions of code to be re-written). The ultimate ultimate goal!

## Wireframes

**Landing page**
![Landing page](https://i.imgur.com/Brylj1a.png)

**Question / answer page**
![Question / answer page](https://i.imgur.com/rJaNx49.png)

**Victory page**
![Victory page](https://i.imgur.com/prjQUYz.png)
