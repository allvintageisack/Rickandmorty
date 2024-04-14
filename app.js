fetch("https://rickandmortyapi.com/api/character/")
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json(); //converts response to JSON format
    })
    .then(data => {
        //gets the total numer of pages from the API
        const totalPages = data.info.pages;
        //creates an array to store all the data from the API
        const fetchRequests = [];

        // a loop which fetches data from the API and loops all the characters 
        for (let i = 1; i <= totalPages; i++) {
            //a fetch request for each page into the array
            fetchRequests.push(fetch(`https://rickandmortyapi.com/api/character/?page=${i}`)
                .then(response => {
                    //checking if the response is positive
                    if (!response.ok) {
                        throw new Error(`Error fetching data from page ${i}: ${response.statusText}`);
                        //if the response is negative the error is executed
                    }
                    return response.json();
                })
                .then(data => data.results) //gets character data from the response
                .catch(error => console.error(error)));
        }

        Promise.all(fetchRequests)
            .then(pagesData => {
                //making a single array to store data of all characters
                const allCharacters = pagesData.flat();
                displayCharacters(allCharacters); //calling a function to display the characters on the browser

            })
            .catch(error => console.error("Error fetching characters from all pages:", error));
    })
    .catch(error => console.error("Error fetching data from first page:", error));

function displayCharacters(characters) { //function to display all the characters on the browser
    //creates a container where character cards will be displayed 
    const cardContainer = document.getElementById("card-group");
    //creates a document fragment to efficiently append multiple elements
    const fragment = document.createDocumentFragment();

//creates a card for each character
    characters.forEach(character => {
        //creates a div for the character card
        const card = document.createElement("div");
        //adds a css class to the card element
        card.classList.add("card");
        //set the inner HTML of the card with character information
        card.innerHTML = `
            <h2>${character.name}</h2>
            <h4>Status: ${character.status}</h4>
            <h4>Species: ${character.species}</h4>
            <img src="${character.image}" alt="${character.name}" class="card-img-top">
        `;
        fragment.appendChild(card);
    });

    cardContainer.innerHTML = ''; // Clear existing content
    cardContainer.appendChild(fragment);
}
