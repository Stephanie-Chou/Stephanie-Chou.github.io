import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [cityInput, setCityInput] = useState("");
  const [dayTrips, setDayTrips] = useState();
  const [activities, setActivities] = useState();

  function renderWalkingTourShort(tour) {
    return tour.map((step) => {
      return <li>{step.name}</li>
    });
  }
  
  function renderDayItineraries() {
    if (!activities) return;
    return activities.map((day) => {
      return (
        <div>
          <div className={styles.itineraryPage}>
            <div className={styles.header}>
            <div className={styles.tag}>
              <div className={styles.tagHeader}>{cityInput}</div>
              <div className={styles.tagSubheader}>Day {day.day}</div>
            </div>
            </div>
            <div className={styles.container}>
              <table>
                <tr>
                  <th> Date and Location </th>
                  <th> Description </th>
                </tr>
                <tr>
                  <td>{day.site}</td>
                  <td>{day.short_desc}</td>
                </tr>
                <tr>
                  <td> <div>Lunch</div> {day.food.lunch.name}</td>
                  <td>{day.food.lunch.desc}</td>
                </tr>
                <tr>
                  <td>Walking tour of {day.neighborhood}</td>
                  <td>
                    <ol>{renderWalkingTourShort(day.walking_tour)}</ol>
                  </td>
                </tr>
                <tr>
                  <td> <div>Dinner</div> {day.food.dinner.name}</td>
                  <td>{day.food.dinner.desc}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      )
    });
  }

  function renderDayTripItinerary() {
    if (!dayTrips) return;

    return dayTrips.map((trip) => {
      return (
        <div className={styles.itineraryPage}>
          <div className={styles.header}>
            <div className={styles.tag}>
              <div className={styles.tagHeader}>{cityInput}</div>
              <div className={styles.tagSubheader}>Day Trip</div>
            </div>
          </div>
          <div className={styles.container}>
            <h1>{trip.name}</h1>
            <div className={styles.longDescription}>{trip.long_desc}</div>
            <table>
              <tr>
                <th> Date and Location </th>
                <th> Description </th>
              </tr>
              <tr>
                <td>Morning Travel</td>
                <td>Travel to {trip.name}</td>
              </tr>
              <tr>
                <td>{trip.name}</td>
                <td>{trip.short_desc}</td>
              </tr>
              <tr>
                <td>Eat at {trip.food.name}</td>
                <td>{trip.food.desc}</td>
              </tr>
            </table>
          </div>
        </div>
      )
    })

  }

  async function fetchDayTrips() {
    try {
      const response = await fetch("/api/generateDayTrip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ city: cityInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      console.log("day trip result", data.result.toString());
      const jsonParse = JSON.parse(data.result.toString());
      const dayTrips = jsonParse.day_trips; // list of daytrip ojects

      setDayTrips(dayTrips);
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  async function fetchActivities() {
        /**
    * let sample_response ={
      "activities":[{
          "day": "1",
          "neighborhood": "Ancient Rome",
          "site": "Colosseum",
          "short_desc": "Iconic amphitheater of Ancient Rome, known for gladiatorial contests.",
          "long_desc": "Step into the grandeur of Ancient Rome at the Colosseum, the largest amphitheater ever built. Discover the history of gladiators, explore the vast arena, and marvel at the architectural masterpiece that has stood for centuries.",
          "walking_tour": [
            {
              "name": "Roman Forum",
              "desc":"Immerse yourself in the ruins of the political and social center of Ancient Rome, filled with temples, basilicas, and ancient buildings."
            },
            {
              "name": "Palatine Hill",
              "desc":"Explore the birthplace of Rome's civilization and enjoy panoramic views of the city from this historic hill."
            },
            {
              "name": "Circus Maximus",
              "desc":"Wander through the ancient chariot racing stadium and imagine the excitement of the games that once took place here."
            }
          ],
          "food": {
            "lunch": {
              "name":  "Trattoria da Lucia",
              "desc":"Indulge in traditional Roman cuisine, including pasta, pizza, and classic Roman dishes."
            },
            "dinner": {
              "name": "Osteria Barberini",
              "desc":"Experience authentic Roman flavors in a cozy and welcoming atmosphere."
            }
          }
        },
        {
          "day": "2",
          "neighborhood": "Vatican City",
          "site": "Vatican Museums",
          "short_desc": "World-renowned art collection, including the Sistine Chapel.",
          "long_desc": "Explore the vast art collection of the Vatican Museums, housing masterpieces from different periods and cultures. Marvel at the stunning frescoes in the Sistine Chapel painted by Michelangelo and admire works by renowned artists like Raphael and Leonardo da Vinci.",
          "walking_tour": [
            {
              "name": "St. Peter's Basilica",
              "desc":"Discover the largest church in the world, known for its breathtaking architecture and religious significance."
            },
            {
              "name": "Vatican Gardens",
              "desc":"Stroll through the beautifully landscaped gardens, filled with lush greenery, fountains, and sculptures."
            },
            {
              "name": "Castel Sant'Angelo",
              "desc":"Visit this ancient fortress and former papal residence, offering panoramic views of Rome from its terrace."
            }
          ],
          "food": {
            "lunch": {
              "name":  "Ristorante il Fico",
              "desc":"Enjoy a delightful Italian meal with fresh ingredients and a charming ambiance near the Vatican."
            },
            "dinner":{
              "name":  "Hostaria Romana",
              "desc":"Indulge in classic Roman dishes, including cacio e pepe and saltimbocca alla romana."
            }
          }
        },
        {
          "day":"3",
          "neighborhood": "Trastevere",
          "site": "Piazza Santa Maria in Trastevere",
          "short_desc": "Lively square in the charming Trastevere neighborhood.",
          "long_desc": "Immerse yourself in the vibrant atmosphere of Trastevere at Piazza Santa Maria in Trastevere. Admire the beautiful Basilica of Santa Maria in Trastevere, relax at a café while people-watching, and soak up the lively energy of this picturesque square.",
          "walking_tour": [
            {
              "name": "Villa Farnesina",
              "desc":"Explore this Renaissance villa adorned with exquisite frescoes by renowned artists like Raphael."
            },
            {
              "name": "Gianicolo Hill",
              "desc":"Climb to the top of this hill for stunning views of Rome's skyline and the opportunity to witness the traditional midday cannon firing."
            },
            {
              "name": "Isola Tiberina",
              "desc":"Cross the Tiber River to reach this charming island and take a leisurely stroll along its picturesque streets."
            }
          ],
          "food": {
            "lunch":{
              "name":  "Da Enzo al 29",
              "desc":"Taste authentic Roman cuisine with homemade pasta and traditional dishes in the heart"
            },
            "dinner": {
              "name": "La Tavernaccia",
              "desc": "known for its traditional Roman cuisine and warm ambiance."
            }
          }
        }
      ],
      "day_trips": [{
          "name": "Yosemite National Park",
          "short_desc": "Experience the beauty of this world-famous park, with its towering cliffs and cascading waterfalls.",
          "long_desc": "This day trip takes you to Yosemite National Park, one of the most stunning and iconic natural landmarks in the United States. Explore the majestic sequoia groves, towering cliffs, and cascading waterfalls, and don't miss the opportunity to take a hike or a scenic drive. ",
          "food": {
            "name": "The Ahwahnee",
            "desc": "Located in Yosemite National Park, The Ahwahnee offers a unique dining experience. Enjoy the freshest ingredients and exquisite seasonal specialties. "
          }
        },
        {
          "name": "Muir Woods National Monument",
          "short_desc": "Stroll through ancient redwood groves in this tranquil sanctuary near San Francisco.",
          "long_desc": "This day trip takes you to Muir Woods National Monument, a tranquil sanctuary of ancient redwood groves. Enjoy the peace and quiet of this stunning natural wonder, and don't forget to explore nearby Mount Tamalpais for breathtaking views of the bay. ",
          "food": {
            "name": "The Counter",
            "desc": "Stop by The Counter for a delicious and creative meal. Try one of their signature burgers, salads, or sandwiches."
          }
        }
      ]
    }

    const activities = sample_response.activities; // list of activity objects
    const dayTrips = sample_response.day_trips; // list of daytrip ojects
    setActivities(activities);
    setDayTrips(dayTrips);
*/
    try {
      const response = await fetch("/api/generateActivity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ city: cityInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      console.log("Activity result", data.result.toString());
      const jsonParse = JSON.parse(data.result.toString());
      const activities = jsonParse.activities; // list of activity objects

      setActivities(activities);
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }
  async function onSubmit(event) {
    event.preventDefault();
    fetchActivities();
    fetchDayTrips();
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
      </Head>

      <main className={styles.main}>
        <div className={styles.input}>
          <h3>Trip Planner 1.0 - {cityInput}</h3>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              name="city"
              placeholder="Tell me where you are going (city)"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
            />
            <input type="submit" value="Plan it for Me" />
          </form>
        </div>
        <div className={styles.result}>
          {renderDayItineraries()}
          {renderDayTripItinerary()}
        </div>
      </main>
    </div>
  );
}
