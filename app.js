window.addEventListener('load', async () => {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
    } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
    } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }

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
