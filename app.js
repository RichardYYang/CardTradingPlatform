window.addEventListener('load', async () => {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
    } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
    } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
    
    // Load smart contract
    const contractAddress = 'YOUR_CONTRACT_ADDRESS';
    const contractABI = [
        // Contract ABI (copy from the compiled contract)
    ];
    const marketplaceContract = new web3.eth.Contract(contractABI, contractAddress);
    
    // Create Card Form
    const createCardForm = document.getElementById('createCardForm');
    createCardForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const price = document.getElementById('price').value;
        
        try {
            await marketplaceContract.methods.createCard(name, description, price).send({ from: web3.eth.defaultAccount });
            alert('Card created successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to create card.');
        }
        
        // Clear form inputs
        document.getElementById('name').value = '';
        document.getElementById('description').value = '';
        document.getElementById('price').value = '';
    });
    
    // Load and display existing trading cards
    const cardList = document.getElementById('cardList');
    
    function displayCard(card) {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        
        const nameElement = document.createElement('h3');
        nameElement.textContent = card.name;
        cardElement.appendChild(nameElement);
        
        const ownerElement = document.createElement('p');
        ownerElement.textContent = 'Owner: ' + card.owner;
        cardElement.appendChild(ownerElement);
        
        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = card.description;
        cardElement.appendChild(descriptionElement);
        
        const priceElement = document.createElement('p');
        priceElement.textContent = 'Price: ' + card.price + ' ETH';
        cardElement.appendChild(priceElement);
        
        const buyButton = document.createElement('button');
        buyButton.textContent = 'Buy';
        buyButton.addEventListener('click', async () => {
            try {
                await marketplaceContract.methods.transferCard(card.id, web3.eth.defaultAccount).send({ from: web3.eth.defaultAccount });
                alert('Card purchased successfully!');
            } catch (error) {
                console.error(error);
                alert('Failed to purchase card.');
            }
        });
        cardElement.appendChild(buyButton);
        
        cardList.appendChild(cardElement);
    }
    
    async function loadCards() {
        const cardCount = await marketplaceContract.methods.cardCount().call();
        
        for (let i = 1; i <= cardCount; i++) {
            const card = await marketplaceContract.methods.cards(i).call();
            displayCard(card);
        }
    }
    
    loadCards();
});
