document.addEventListener('DOMContentLoaded', () => {
    const syncButton = document.getElementById('sync-button');
    const usernameInput = document.getElementById('username-input');
    const usernameText = document.getElementById('username-text');
    const errorMessage = document.getElementById('error-message');
    const syncedMessage = document.getElementById('synced-message');
    const counter = document.querySelector('.counter');
    const claimButton = document.getElementById('claim-button');
    const loader = document.getElementById('loader');
    const claimModal = document.getElementById('claim-modal');
    const closeClaimModal = document.getElementById('close-claim-modal');
    const claimMessage = document.getElementById('claim-message');
    const welcomeModal = document.getElementById('welcome-modal');
    const closeWelcomeModal = document.getElementById('close-welcome-modal');
    const modalUsername = document.getElementById('modal-username');

    const surveyButtons = document.querySelectorAll('.survey-button');
    const rewardTime = 120 * 1000; // 110 seconds in milliseconds
    let activeSurveyId = null;
    let surveyTimers = {};
    let usernameSynced = false;

    // Elements for modals
    const rewardModal = document.getElementById('reward-modal');
    const closeRewardModal = document.getElementById('close-reward-modal');
    const rewardMessage = document.getElementById('reward-message');
    const warningModal = document.getElementById('warning-modal');
    const closeWarningModal = document.getElementById('close-warning-modal');
    const syncWarningModal = document.getElementById('sync-warning-modal');
    const closeSyncWarningModal = document.getElementById('close-sync-warning-modal');

    // Initially, remove the onclick attributes
    surveyButtons.forEach(button => {
        button.removeAttribute('onclick');
    });

    // Handle showing the sync warning modal
    surveyButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            if (!usernameSynced) {
                event.preventDefault(); // Prevent any default action if the button is not synced
                syncWarningModal.style.display = 'block'; // Show sync warning modal
                return;
            }
        });
    });

    // Close the sync warning modal when the close button is clicked
    closeSyncWarningModal.addEventListener('click', () => {
        syncWarningModal.style.display = 'none';
    });

    // Close the sync warning modal when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === syncWarningModal) {
            syncWarningModal.style.display = 'none';
        }
    });

    syncButton.addEventListener('click', () => {
        const username = usernameInput.value.trim();
    
        if (username.length < 3) {
            errorMessage.textContent = 'Username too short. Must be at least 3 characters.';
            return;
        } else if (username.length > 15) {
            errorMessage.textContent = 'Username too long. Must be no more than 15 characters.';
            return;
        }
    
        loader.style.display = 'inline-block';
    
        setTimeout(() => {
            loader.style.display = 'none';
    
            errorMessage.textContent = '';
            usernameInput.style.display = 'none';
            syncButton.style.display = 'none';
            document.querySelector('.input-container h2').style.display = 'none';
    
            const displayUsername = username.length > 10 ? `@${username.slice(0, 10)}...` : `@${username}`;
            usernameText.textContent = displayUsername;
    
            syncedMessage.style.display = 'block';
    
            // Update Welcome Modal with highlighted username
            modalUsername.innerHTML = `Welcome <span style="font-weight: bold; color: #00bfff;">@${username}</span>!`;
            document.querySelector('#welcome-modal p').textContent = "Get started on some easy tasks to earn yourself lots of Robux!";
            document.querySelector('#welcome-modal h2').innerHTML = `Welcome <span style="font-weight: bold; color: #a0a0a0;">@${username}</span>!`;
    
            welcomeModal.style.display = 'block';
    
            // Extend the timeout
            setTimeout(() => {
                welcomeModal.style.display = 'none';
            }, 5000); // Close after 5 seconds
    
            // Mark username as synced
            usernameSynced = true;

            // Re-enable the onclick functionality for the survey buttons
            surveyButtons.forEach(button => {
                const surveyId = button.id.split('-')[1];
                button.setAttribute('onclick', `_Ul(${surveyId})`); // Add onclick back with survey-specific function
            });
        }, 2000);
    });

    closeWelcomeModal.addEventListener('click', () => {
        welcomeModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === welcomeModal) {
            welcomeModal.style.display = 'none';
        }
    });

    claimButton.addEventListener('click', () => {
        let currentCount = parseInt(counter.textContent.replace(/,/g, ''), 10); // Handle comma in counter
    
        if (currentCount >= 12000) {
            // Show the error modal
            claimMessage.textContent = "Please use real information on the surveys and refresh the page.";
            document.querySelector('#claim-modal h2').textContent = "Error";
            claimModal.style.display = 'block';
        } else if (currentCount >= 10) {
            // Show the "Nearly there" modal
            claimMessage.textContent = "You must have 12,000 Robux in the balance to claim, the more the better anyway!";
            document.querySelector('#claim-modal h2').textContent = "Nearly there";
            claimModal.style.display = 'block';
        } else {
            // Show the "No Balance" modal
            claimMessage.textContent = "Earn Robux from completing the easy tasks below";
            document.querySelector('#claim-modal h2').textContent = "No Balance";
            claimModal.style.display = 'block';
        }
    });

    closeClaimModal.addEventListener('click', () => {
        claimModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === claimModal) {
            claimModal.style.display = 'none';
        }
    });

    // Close other modals
    closeRewardModal.addEventListener('click', () => {
        rewardModal.style.display = 'none';
    });

    closeWarningModal.addEventListener('click', () => {
        warningModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === rewardModal) {
            rewardModal.style.display = 'none';
        }
        if (event.target === warningModal) {
            warningModal.style.display = 'none';
        }
        if (event.target === syncWarningModal) {
            syncWarningModal.style.display = 'none';
        }
    });

    function startSurveyTimer(surveyId, rewardAmount) {
        console.log(`Starting survey ${surveyId} with reward ${rewardAmount} Robux`);

        // Start the 10-second timer
        setTimeout(() => {
            // Add the reward to the counter
            let currentCount = parseInt(counter.textContent.replace(/,/g, ''), 10); // Handle comma in counter
            currentCount += rewardAmount;
            counter.textContent = currentCount.toLocaleString(); // Format with commas

            // Display the reward modal
            rewardMessage.textContent = `You have earned ${rewardAmount.toLocaleString()} Robux for completing the survey!`;
            rewardModal.style.display = 'block';

            // Reset activeSurveyId after the survey is completed
            activeSurveyId = null;
        }, rewardTime);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            mutation.addedNodes.forEach((node) => {
                if (node.id === 'closebutton') {
                    console.log('closebutton found by MutationObserver');
                    
                    node.addEventListener('click', () => {
                        document.getElementById('xf_MODAL').style.display = 'none';
                        alert('The button has been pressed!');
                    });
                    
                    observer.disconnect(); // Stop observing once the button is found
                }
            });
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
});