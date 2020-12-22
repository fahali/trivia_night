# Trivia Night

A trivia game featuring questions from the [Open Trivia Database API](https://opentdb.com/api_config.php). The live version of the game is hosted [here](https://fahali.github.io/trivia_night). No installs are necessary, just visit the webpage and enjoy the game! (Please excuse the current appearance of the webpage as the project is still a work in progress)

## Technologies Used

This project will be written in HTML, CSS, and vanilla Javascript. One of the stretch goals (the last one, actually), is to re-write the Javascript using jQuery, just as a personal challenge to help me learn the technology.

The project is hosted via GitHub Pages, served directly from my public repo.

Features and issue tracking / management is handled with Trello. Check out my progress [here](https://trello.com/b/LL1B6SMi/trivia-night-seir-p1).

## Interesting challenges

One issue that became apparent right away was encoding issues. If the questions or answers being served had special characters, those characters would be returned encoded with HTML entities. I had a really hard time getting those entities to render properly without resorting to hacky methods like using the `.innerHTML` properties of `HTMLElement` objects. The first solution was to use `base64` encoding, but that brought about its own headaches. It seemed like with `base64`, I was running into Unicode character issues. Luckily the API can also serve the information encoded as a URI (established with [RFC 3986](https://www.ietf.org/rfc/rfc3986.txt)), which ultimately ended up being the solution I needed.

## User Stories

TODO

## Wireframes

TODO

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
| Dec 22 | Last touches / Polishing up                              | incomplete  |
| Dec 23 | Presentations                                            |
