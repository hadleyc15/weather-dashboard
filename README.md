GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city

My first step in this project was to create the html and css for how I wanted my dashboard to look.  
Here is what i ended up with:

<img src="/assets/images/Screenshot%20(37).png" />

The next step i took in this project was to obtain my api key for the weather website to add to my Javascript to get the data needed for this project.
I set my key up and added the necessary code in my js file to begin fetching data for the input city.  At first i didnt understand what was happenning with the tempurature
that was being returned. I discovered that this particular api sends the tempurature in Kelvin.....not sure why....

<img src="/assets/images/Screenshot%20(35).png" />

So I had to google the mathematical way to convert Kelvin to Fahrenheit and include that in the code.  Im sure there is probably a way to get the api to return the temp in 
Far=hrenheit but I couldn't find it.  So i opted to just add the math to the code.

<img src="/assets/images/Screenshot%20(36).png" />

After that I worked on the five day display.  At first I was not successful.  I was getting data to display in all five boxes but it was all the same day and not five different days.
With help from my tutor, we discovered that my for loop was overriding my ajax call for that data.  The for loop was not giving the ajax call time to call the api before it diplayed
the data.  So we moved the ajax call out of the for loop and it fixed that problem.

<img src="/assets/images/Screenshot%20(38).png" />

The next part I worked on was making the previous searched cities list on the left hand side of the deployed application.  This also created a few bugs for me as it logged the searched city
even if it was already there.  So if i searched the same city I ended up with it appearing multiple times.  My tutor helped me figure out and if then statement that would check the list for
the city and if it was already there, it would not be added.

<img src="/assets/images/Screenshot%20(39).png" />

The last part was to transform the searched cities into buttons that could be clicked for easy searching for previous entries.

<img src="/assets/images/Screenshot%20(40).png" />

Deployed URL:

Github Repo: