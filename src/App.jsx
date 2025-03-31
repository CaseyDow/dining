import React, { useState, useEffect } from 'react';
import './App.css'; // Import the CSS file

const getNextFiveDays = () => {
  const today = new Date();
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + i);
    dates.push(nextDay.toISOString().split('T')[0]); // Format as 'YYYY-MM-DD'
  }
  const nextDay = new Date(today);
  nextDay.setDate(today.getDate() - 1);
  dates.push(nextDay.toISOString().split('T')[0]); // Format as 'YYYY-MM-DD'
  return dates;
};

const Category = (props) => {
  return (
    <li key={props.mealOption.menuId}>
      <div className="font-bold">{props.mealOption.mealOptionName}</div>
      <ul>
        {props.mealOption.menuRows?.map((item) => (
          <Item key={item.menuRowId} id={item.recipeId ? item.recipeId : item.ingredientId} ingredient={!!item.ingredientId} />
        ))}
      </ul>
      <br />
    </li>
  );
};

const Item = (props) => {
  const [data, setData] = useState([]);
  const [isPopupVisible, setPopupVisible] = useState(false);

  const handleItemClick = () => {
    setPopupVisible(true); // Show the pop-up when item is clicked
  };

  const handleClosePopup = () => {
    setPopupVisible(false); // Hide the pop-up when close button is clicked
  };

  useEffect(() => {
    const url = "https://live-ucla-dining.pantheonsite.io/wp-content/uploads/jamix/" + (props.ingredient ? `ingredients/${props.id}.json` : `recipes/${props.id}.json`);
    const proxyUrl = `https://cors.casey-dow.workers.dev/?url=${encodeURIComponent(url)}`;

    fetch(proxyUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }, [props.id]);

  const renderNutritionalInfo = () => {
    const nutritiveValues = data.ingredientNutritiveValues || Object.fromEntries(Object.entries(data.recipeNutritiveValues).map(([key, item]) => [key, item.value])
);
    console.log(data)

    if (!nutritiveValues) return null;

    return (
      <div>
        <div className="flex flex-row p-1">
          <div className="text-sm">Serving Size {data.recipePortions || data.portion}{data.recipePortionSizeUnit || data.portionUnit}</div>
          <div className="flex-grow" />
        </div>
        <hr className="w-19/20 h-0.05 text-gray-300 m-auto"/>
        <div className="flex flex-row p-1">
          <div className="text-xs font-thin">Amount per Serving</div>
          <div className="flex-grow" />
        </div>
        <div className="flex flex-row p-1">
          <div className="text-xl font-bold">Calories</div>
          <div className="flex-grow" />
          <div>{Math.round(nutritiveValues.energyKcal)} kcal</div>
        </div>
        <hr className="w-19/20 h-0.05 text-gray-300 m-auto"/>
        <div className="flex flex-row p-1">
          <div className="flex-grow" />
          <div className="text-sm font-thin">% Daily Value</div>
        </div>
        <hr className="w-19/20 h-0.05 text-gray-300 m-auto"/>
        <div className="flex flex-row p-1">
          <div className="font-bold">Fat {nutritiveValues.fat.toFixed(1)}g</div>
          <div className="flex-grow" />
          <div>{Math.round((nutritiveValues.fat / 78) * 100)}%</div>
        </div>
        <hr className="w-19/20 h-0.05 text-gray-300 m-auto"/>
        <div className="flex flex-row indent-3 p-1">
          <div>Saturated Fat {nutritiveValues.saturatedFat.toFixed(1)} g</div>
          <div className="flex-grow" />
          <div>{Math.round((nutritiveValues.saturatedFat / 20) * 100)}%</div>
        </div>
        <hr className="w-19/20 h-0.05 text-gray-300 m-auto"/>
        <div className="flex flex-row p-1">
          <div className="font-bold">Sodium {nutritiveValues.sodium.toFixed(1)} mg</div>
          <div className="flex-grow" />
          <div>{Math.round((nutritiveValues.sodium / 2300) * 100)}%</div>
        </div>
        <hr className="w-19/20 h-0.05 text-gray-300 m-auto"/>
        <div className="flex flex-row p-1">
          <div className="font-bold">Total Carbohydrate {nutritiveValues.carbohydrate.toFixed(1)} g</div>
          <div className="flex-grow" />
          <div>{Math.round((nutritiveValues.carbohydrate / 275) * 100)}%</div>
        </div>
        <hr className="w-19/20 h-0.05 text-gray-300 m-auto"/>
        <div className="flex flex-row indent-3 p-1">
          <div>Fiber {nutritiveValues.fibre.toFixed(1)} g</div>
          <div className="flex-grow" />
          <div>{Math.round((nutritiveValues.fibre / 28) * 100)}%</div>
        </div>
        <hr className="w-19/20 h-0.05 text-gray-300 m-auto"/>
        <div className="flex flex-row indent-3 p-1">
          <div>Sugars {nutritiveValues.sugars.toFixed(1)} g</div>
          <div className="flex-grow" />
        </div>
        <hr className="w-19/20 h-0.05 text-gray-300 m-auto"/>
        <div className="flex flex-row indent-6 p-1">
          <div>Includes Added Sugars {nutritiveValues.addedSugar.toFixed(1)} g</div>
          <div className="flex-grow" />
          <div>{Math.round((nutritiveValues.addedSugar / 50) * 100)}%</div>
        </div>
        <hr className="w-19/20 h-0.05 text-gray-300 m-auto"/>
        <div className="flex flex-row p-1">
          <div className="font-bold">Protein {nutritiveValues.protein.toFixed(1)} g</div>
          <div className="flex-grow" />
          <div>{Math.round((nutritiveValues.protein / 50) * 100)}%</div>
        </div>
        <hr className="w-19/20 h-0.05 text-gray-300 m-auto"/>
        <div className="flex flex-row p-1">
          <div className="flex flex-row min-w-1/2 pr-4">
            <div className="font-bold">Calcium {nutritiveValues.calcium.toFixed(1)} mg</div>
            <div className="flex-grow" />
            <div>{Math.round((nutritiveValues.calcium / 1300) * 100)}%</div>
          </div>
          <div className="flex flex-row min-w-1/2">
            <div className="font-bold">Iron {nutritiveValues.iron.toFixed(1)} mg</div>
            <div className="flex-grow" />
            <div>{Math.round((nutritiveValues.iron / 18) * 100)}%</div>
          </div>
        </div>
        <hr className="w-19/20 h-0.05 text-gray-300 m-auto"/>
        <div className="flex flex-row p-1">
          <div className="flex flex-row min-w-1/2 pr-4">
            <div className="font-bold">Potassium {nutritiveValues.potassium.toFixed(1)} mg</div>
            <div className="flex-grow" />
            <div>{Math.round((nutritiveValues.potassium / 4700) * 100)}%</div>
          </div>
          <div className="flex flex-row min-w-1/2">
            <div className="font-bold">Vitamin D {nutritiveValues.vitaminD.toFixed(1)} mg</div>
            <div className="flex-grow" />
            <div>{Math.round((nutritiveValues.vitaminD / 20) * 100)}%</div>
          </div>
        </div>
        <div className="p-3">
          <div className="font-bold">Ingredients:</div> {(data.recipeListOfIngredientsTranslations || data.ingredientNameTranslations).EN.replace(/<strong>/g,"").replace(/<\/strong>/g,"")}
        </div>
      </div>
    );
  };

  return (
    <li key={props.id} className="text-black">
      <span onClick={handleItemClick} style={{ cursor: 'pointer', color: 'blue' }} className="">
        <div className="ps-12 -indent-6 text-black flex flex-wrap">
        {data ? (props.ingredient ? data.ingredientNameTranslations?.EN : (data.recipeNameTranslations?.EN || data.recipeName)) : ""}
        {
          data?.recipeAllergens?.map(obj => {
            return <div className={`p-3 inline recipe-metadata-item metadata-${obj.allergenName.toLowerCase()}`} />
            })
        }
        </div>
      </span>

      {isPopupVisible && (
        <div className="overlay">
          <div className="popup">
            <button onClick={handleClosePopup} className="closeButton">Close</button>
            {renderNutritionalInfo()}
          </div>
        </div>
      )}
    </li>
  );
};


const App = () => {
  const nextFiveDays = getNextFiveDays();
  const [menus, setMenus] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState(nextFiveDays[0]);
  const [filteredData, setFilteredData] = useState(null);
  const [filteredPeriods, setFilteredPeriods] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);

  useEffect(() => {
    const url = `https://live-ucla-dining.pantheonsite.io/wp-content/uploads/jamix/menus/${selectedDate}.json`;
    const proxyUrl = `https://cors.casey-dow.workers.dev/?url=${encodeURIComponent(url)}`;

    fetch(proxyUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        function cleanMenuData(menuData) {
          return menuData.map(menu => {
            menu.menuWeeks = menu.menuWeeks.map(week => {
              week.menuDays = week.menuDays.filter(day => {
                day.menuDayMealOptions = day.menuDayMealOptions.filter(mealOption => {
                  return mealOption.menuRows?.length > 0;
                });
                return day.menuDayMealOptions.length > 0;
              });
              return week;
            });
            menu.menuWeeks = menu.menuWeeks.filter(week => week.menuDays.length > 0);
            return menu;
          }).filter(menu => menu.menuWeeks.length > 0);
        }
        const cleanData = cleanMenuData(data);
        console.log(cleanData);
        setMenus(cleanData);

        let periods = [...new Set(Object.values(cleanData).filter(obj => obj.menuName.includes("Service")).map(obj => obj.menuGroupName))];
        let sortedPeriods = ["Breakfast", "Lunch", "Dinner"].filter(obj => periods.includes(obj));
        setFilteredPeriods(sortedPeriods);
        let period = selectedMeal;
        if (!sortedPeriods.includes(period)) {
          period = sortedPeriods[0];
          setSelectedMeal(period);
        }

        const locations = [...new Set(Object.values(cleanData).filter(obj => obj.menuGroupName == period && obj.menuName.includes("Service")).map(obj => obj.storeName))]
        setFilteredLocations(locations);
        let location = selectedLocation;
        if (!locations.includes(location)) {
          location = locations[0];
          setSelectedLocation(location);
        }

        const storeData = Object.values(cleanData).find((store) => (store.storeName === location && store.menuGroupName === period));
        setFilteredData(storeData); 

      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }, [selectedDate]);

  const selectDate = (event) => {
    setSelectedDate(event.target.value);
  };

  const selectMeal = (event) => {
    setSelectedMeal(event.target.value);
    const locations = [...new Set(Object.values(menus).filter(obj => obj.menuGroupName == event.target.value && obj.menuName.includes("Service")).map(obj => obj.storeName))]
    setFilteredLocations(locations);
    let location = selectedLocation;
    if (!locations.includes(location)) {
      location = locations[0];
      setSelectedLocation(location);
    }
    const storeData = Object.values(menus).find((store) => (store.storeName === location && store.menuGroupName === event.target.value));
    setFilteredData(storeData); 
  };

  const selectStore = (event) => {
    setSelectedLocation(event.target.value);
    const storeData = Object.values(menus).find((store) => (store.storeName === event.target.value && store.menuGroupName === selectedMeal));
    setFilteredData(storeData); 
  };

  return (
    <div className="p-10 min-h-full">
      <div className="text-2xl font-bold">UCLA Dining Menus</div>

      <select onChange={selectDate} value={selectedDate}>
        <option value="">Select Date</option>
        <option value={nextFiveDays[7]} key="-1">Yesterday {nextFiveDays[7]}</option>
        <option value={nextFiveDays[0]} key="0">Today {nextFiveDays[0]}</option>
        <option value={nextFiveDays[1]} key="1">Tomorrow {nextFiveDays[1]}</option>
        <option value={nextFiveDays[2]} key="2">{nextFiveDays[2]}</option>
        <option value={nextFiveDays[3]} key="3">{nextFiveDays[3]}</option>
        <option value={nextFiveDays[4]} key="4">{nextFiveDays[4]}</option>
        <option value={nextFiveDays[5]} key="4">{nextFiveDays[5]}</option>
        <option value={nextFiveDays[6]} key="4">{nextFiveDays[6]}</option>
      </select>

      {selectedDate && (<select onChange={selectMeal} value={selectedMeal}>
        <option value="">Select meal</option>
          {filteredPeriods.map(period => (
            <option value={period} key={period}>{period}</option>
            ))}
        </select>
      )}

      {selectedMeal && (
        <select onChange={selectStore} value={selectedLocation}>
          <option value="">Select meal</option>
          {filteredLocations.map(location => (
            <option value={location} key={location}>{location}</option>
            ))}
        </select>
      )}

      {filteredData ? (
        <div>
          <br />
          <ul>
            {filteredData.menuWeeks[0]?.menuDays[0]?.menuDayMealOptions.map((category) => (
              <Category key={category.mealOptionId} mealOption={category} />
            ))}
          </ul>
        </div>
      ) : (
        <p>Please select a store to see the items.</p>
      )}
    </div>
  );
};

export default App;
