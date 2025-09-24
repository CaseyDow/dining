import React, { useState, useEffect } from 'react';
import './App.css';

const getNextFiveDays = () => {
  const today = new Date();
  const dates = [];

  for (let i = 0; i < 5; i++) {
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + i);
    dates.push(nextDay.toLocaleDateString('fr-CA').split('T')[0]);
  }

  const nextDay = new Date(today);
  nextDay.setDate(today.getDate() - 1);
  dates.push(nextDay.toLocaleDateString('fr-CA').split('T')[0]);

  return dates;
};

const Category = ({ mealOption }) => (
  <li key={mealOption.menuId} className="category-item">
    <div className="category-header">{mealOption.mealOptionName}</div>
    <ul className="row-item">
      {mealOption.menuRows?.map((item) => (
        <Item
          key={item.menuRowId}
          id={item.recipeId ? item.recipeId : item.ingredientId}
          ingredient={!!item.ingredientId}
        />
      ))}
    </ul>
    <br />
  </li>
);

const Item = ({ id, ingredient }) => {
  const [data, setData] = useState([]);
  const [isPopupVisible, setPopupVisible] = useState(false);

  const handleItemClick = () => setPopupVisible(true);
  const handleClosePopup = () => setPopupVisible(false);

  useEffect(() => {
    const url = `https://live-ucla-dining.pantheonsite.io/wp-content/uploads/jamix/${
      ingredient ? `ingredients/${id}.json` : `recipes/${id}.json`
    }`;
    const proxyUrl = `https://cors.casey-dow.workers.dev/?url=${encodeURIComponent(url)}`;

    fetch(proxyUrl)
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((data) => setData(data))
      .catch((error) => console.error('Fetch error:', error));
  }, [id, ingredient]);

  const renderNutritionalInfo = () => {
    const nutritiveValues =
      data.ingredientNutritiveValues ||
      Object.fromEntries(
        Object.entries(data.recipeNutritiveValues || {}).map(([key, item]) => [key, item.value])
      );

    if (!nutritiveValues) return null;

    return (
      <div className="nutritional-info-container">
        <div>
          <div className="nutrient-header">{data.recipeNameTranslations.EN}</div>
        </div>
        <div className="serving-size">
          <div className="text-sm">
            Serving Size {data.recipePortions || data.portion}
            {data.recipePortionSizeUnit || data.portionUnit}
          </div>
          <div className="flex-grow" />
        </div>
        <hr />
        <div className="amount-per-serving">
          <div className="text-xs font-thin">Amount per Serving</div>
          <div className="flex-grow" />
        </div>
        <div className="calories">
          <div className="text-xl">Calories</div>
          <div className="flex-grow" />
          <div>{Math.round(nutritiveValues.energyKcal)} kcal</div>
        </div>
        <hr />
        <div className="daily-value">
          <div className="flex-grow" />
          <div className="text-sm font-thin">% Daily Value</div>
        </div>
        <hr />
        <div className="nutritional-row">
          <div className="font-bold">Fat {nutritiveValues.fat.toFixed(1)}g</div>
          <div className="flex-grow" />
          <div>{Math.round((nutritiveValues.fat / 78) * 100)}%</div>
        </div>
        <hr />
        <div className="nutritional-row">
          <div className="indented">
            Saturated Fat {nutritiveValues.saturatedFat.toFixed(1)} g
          </div>
          <div className="flex-grow" />
          <div>{Math.round((nutritiveValues.saturatedFat / 20) * 100)}%</div>
        </div>
        <hr />
        <div className="nutritional-row">
          <div className="font-bold">Sodium {nutritiveValues.sodium.toFixed(1)} mg</div>
          <div className="flex-grow" />
          <div>{Math.round((nutritiveValues.sodium / 2300) * 100)}%</div>
        </div>
        <hr />
        <div className="nutritional-row">
          <div className="font-bold">
            Total Carbohydrate {nutritiveValues.carbohydrate.toFixed(1)} g
          </div>
          <div className="flex-grow" />
          <div>{Math.round((nutritiveValues.carbohydrate / 275) * 100)}%</div>
        </div>
        <hr />
        <div className="nutritional-row">
          <div className="indented">Fiber {nutritiveValues.fibre.toFixed(1)} g</div>
          <div className="flex-grow" />
          <div>{Math.round((nutritiveValues.fibre / 28) * 100)}%</div>
        </div>
        <hr />
        <div className="nutritional-row">
          <div className="indented">Sugars {nutritiveValues.sugars.toFixed(1)} g</div>
          <div className="flex-grow" />
        </div>
        <hr />
        <div className="nutritional-row">
          <div className="more-indented">
            Includes Added Sugars {nutritiveValues.addedSugar.toFixed(1)} g
          </div>
          <div className="flex-grow" />
          <div>{Math.round((nutritiveValues.addedSugar / 50) * 100)}%</div>
        </div>
        <hr />
        <div className="nutritional-row">
          <div className="font-bold">Protein {nutritiveValues.protein.toFixed(1)} g</div>
          <div className="flex-grow" />
          <div>{Math.round((nutritiveValues.protein / 50) * 100)}%</div>
        </div>
        <hr />
        <div className="two-column-row">
          <div>
            <div className="font-bold">Calcium {nutritiveValues.calcium.toFixed(1)} mg</div>
            <div className="flex-grow" />
            <div>{Math.round((nutritiveValues.calcium / 1300) * 100)}%</div>
          </div>
          <div>
            <div className="font-bold">Iron {nutritiveValues.iron.toFixed(1)} mg</div>
            <div className="flex-grow" />
            <div>{Math.round((nutritiveValues.iron / 18) * 100)}%</div>
          </div>
        </div>
        <hr />
        <div className="two-column-row">
          <div>
            <div className="font-bold">Potassium {nutritiveValues.potassium.toFixed(1)} mg</div>
            <div className="flex-grow" />
            <div>{Math.round((nutritiveValues.potassium / 4700) * 100)}%</div>
          </div>
          <div>
            <div className="font-bold">Vitamin D {nutritiveValues.vitaminD.toFixed(1)} mg</div>
            <div className="flex-grow" />
            <div>{Math.round((nutritiveValues.vitaminD / 20) * 100)}%</div>
          </div>
        </div>
        <div className="ingredient-list">
          <div className="font-bold">Ingredients:</div>{' '}
          {(data.recipeListOfIngredientsTranslations ||
            data.ingredientNameTranslations).EN.replace(/<\/?strong>/g, '')}
        </div>
      </div>
    );
  };

  return (
    <li key={id}>
      <span onClick={handleItemClick} style={{ cursor: 'pointer', color: 'blue' }}>
        <div className="item-list-item">
          {data
            ? ingredient
              ? data.ingredientNameTranslations?.EN
              : data.recipeNameTranslations?.EN || data.recipeName
            : ''}
          {data?.recipeAllergens?.map((obj, index) => (
            <div
              key={obj.allergenName || index}
              className={`recipe-metadata-item metadata-${obj.allergenName.toLowerCase()}`}
            />
          ))}
        </div>
      </span>

      {isPopupVisible && (
        <div className="overlay">
          <div className="popup">
            <button onClick={handleClosePopup} className="closeButton">
              Close
            </button>
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
  const [menuOpen, setMenuOpen] = useState(false); // NEW for hamburger toggle

  useEffect(() => {
    const url = `https://live-ucla-dining.pantheonsite.io/wp-content/uploads/jamix/menus/${selectedDate}.json`;
    const proxyUrl = `https://cors.casey-dow.workers.dev/?url=${encodeURIComponent(url)}`;

    fetch(proxyUrl)
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((data) => {
        function cleanMenuData(menuData) {
          return menuData
            .map((menu) => {
              menu.menuWeeks = menu.menuWeeks
                .map((week) => {
                  week.menuDays = week.menuDays.filter((day) => {
                    day.menuDayMealOptions = day.menuDayMealOptions.filter(
                      (mealOption) => mealOption.menuRows?.length > 0
                    );
                    return day.menuDayMealOptions.length > 0;
                  });
                  return week;
                })
                .filter((week) => week.menuDays.length > 0);
              return menu;
            })
            .filter((menu) => menu.menuWeeks.length > 0);
        }

        const cleanData = cleanMenuData(data);
        setMenus(cleanData);

        let periods = [
          ...new Set(
            Object.values(cleanData)
              .filter((obj) =>
                ['Breakfast', 'Lunch', 'Dinner'].some((meal) => obj.menuName?.includes(meal))
              )
              .map((obj) => obj.menuGroupName)
          ),
        ];
        let sortedPeriods = ['Breakfast', 'Lunch', 'Dinner', 'Late Night'].filter((obj) =>
          periods.includes(obj)
        );
        setFilteredPeriods(sortedPeriods);

        const now = new Date();
        const hour = now.getHours();

        let nextPeriod;
        if (hour < 10) nextPeriod = 'Breakfast';
        else if (hour < 15) nextPeriod = 'Lunch';
        else if (hour < 21) nextPeriod = 'Dinner';
        else nextPeriod = 'Late Night';

        let period = sortedPeriods.includes(selectedMeal) ? selectedMeal : nextPeriod;
        if (!sortedPeriods.includes(period)) period = sortedPeriods[0];
        setSelectedMeal(period);

        const locations = [
          ...new Set(
            Object.values(cleanData)
              .filter((obj) => obj.menuGroupName === period && obj.menuName?.includes(period))
              .map((obj) => obj.storeName)
          ),
        ];
        setFilteredLocations(locations);

        let location = selectedLocation;
        if (!locations.includes(location)) {
          location = locations[0];
          setSelectedLocation(location);
        }

        const storeData = Object.values(cleanData).find(
          (store) => store.storeName === location && store.menuGroupName === period
        );
        setFilteredData(storeData);
      })
      .catch((error) => console.error('Fetch error:', error));
  }, [selectedDate, selectedMeal, selectedLocation]);

  const selectDate = (date) => setSelectedDate(date);

  const selectMeal = (meal) => {
    setSelectedMeal(meal);
    const locations = [
      ...new Set(
        Object.values(menus)
          .filter((obj) => obj.menuGroupName === meal && obj.menuName?.includes(meal))
          .map((obj) => obj.storeName)
      ),
    ];
    setFilteredLocations(locations);

    let location = selectedLocation;
    if (!locations.includes(location)) {
      location = locations[0];
      setSelectedLocation(location);
    }

    const storeData = Object.values(menus).find(
      (loc) => loc.storeName === location && loc.menuGroupName === meal
    );
    setFilteredData(storeData);
  };

  const selectLocation = (location) => {
    setSelectedLocation(location);
    const storeData = Object.values(menus).find(
      (loc) => loc.storeName === location && loc.menuGroupName === selectedMeal
    );
    setFilteredData(storeData);
  };

  return (
    <div className="app-container">
      <div className="app-header">
        <span style={{ minWidth: "100px", display: "inline-block" }}>UCLA Menu</span>
        
        {/* Hamburger icon */}
        <button 
          className="hamburger" 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
        
        <div className={`header-buttons ${menuOpen ? "show" : ""}`}>
          <button onClick={() => (window.location.href = 'https://dining.ucla.edu')}>
            Official Website
          </button>
          <button onClick={() => (window.location.href = 'https://myhousing.hhs.ucla.edu/shib/swipes')}>
            Check Plan Balance
          </button>
          <button onClick={() => (window.location.href = 'https://dining.ucla.edu/hours/')}>
            Today's Hours
          </button>
        </div>
      </div>
      
      <select
        onChange={(event) => selectDate(event.target.value)}
        value={selectedDate}
        className="menu-select"
      >
        <option value="">Select Date</option>
        <option value={nextFiveDays[5]} key="-1">
          Yesterday {nextFiveDays[5]}
        </option>
        <option value={nextFiveDays[0]} key="0">
          Today {nextFiveDays[0]}
        </option>
        <option value={nextFiveDays[1]} key="1">
          Tomorrow {nextFiveDays[1]}
        </option>
        <option value={nextFiveDays[2]} key="2">
          {nextFiveDays[2]}
        </option>
        <option value={nextFiveDays[3]} key="3">
          {nextFiveDays[3]}
        </option>
        <option value={nextFiveDays[4]} key="4">
          {nextFiveDays[4]}
        </option>
      </select>

      {selectedDate && (
        <select
          onChange={(event) => selectMeal(event.target.value)}
          value={selectedMeal}
          className="menu-select"
        >
          <option value="">Select meal</option>
          {filteredPeriods.map((period) => (
            <option value={period} key={period}>
              {period}
            </option>
          ))}
        </select>
      )}

      {selectedMeal && (
        <select
          onChange={(event) => selectLocation(event.target.value)}
          value={selectedLocation}
          className="menu-select"
        >
          <option value="">Select meal</option>
          {filteredLocations.map((location) => (
            <option value={location} key={location}>
              {location}
            </option>
          ))}
        </select>
      )}

      {filteredData ? (
        <ul>
          {filteredData.menuWeeks[0]?.menuDays[0]?.menuDayMealOptions.map((category) => (
            <Category key={category.mealOptionId} mealOption={category} />
          ))}
        </ul>
      ) : (
        <p className="more-indented">Please select a store to see the items.</p>
      )}
    </div>
  );
};

export default App;
