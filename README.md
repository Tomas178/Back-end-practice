# Tickets booking app

## Requirements:

### For administrator

- Create new viewing screenings for watching a movie:

  - Timestamp should be a future date
  - Number of tickets should be a positive integer

- Delete viewing screenings while they are empty

### For users

- Get movies with their title and year by providing a list of their IDs (e.g., `/movies?id=1,2,3`)

- Get a list of screenings available for booking. Screenings should include session information.

  - Timestamp should be a current day or future date.
  - Number of tickets should be positive integer
  - Number of tickets left should be non negative integer and not larger than number of tickets in total.
  - Movie: (title and year)

- Get list of booked tickets

  - Should return non negative number

- Create a booking for movie screening that has some tickets left.
  - On successful booking should return movie information.
