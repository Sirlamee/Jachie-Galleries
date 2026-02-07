// toggle button functionality

document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.FAQ-item');
    
    cards.forEach(card => {
        const toggleBtn = card.querySelector('.toggle-btn');
        const cardContent = card.querySelector('.FAQ-item-content');
        
        toggleBtn.addEventListener('click', function() {
            const isExpanded = cardContent.classList.contains('expanded');
            
            if (isExpanded) {
                // Collapse the card
                cardContent.classList.remove('expanded');
                toggleBtn.classList.remove('active');
                toggleBtn.textContent = '+';
            } else {
                // Close all other expanded cards
                cards.forEach(otherCard => {
                    const otherContent = otherCard.querySelector('.FAQ-item-content');
                    const otherBtn = otherCard.querySelector('.toggle-btn');
                    if (otherContent.classList.contains('expanded')) {
                        otherContent.classList.remove('expanded');
                        otherBtn.classList.remove('active');
                        otherBtn.textContent = '+';
                    }
                });
                
                // Expand the card
                cardContent.classList.add('expanded');
                toggleBtn.classList.add('active');
                toggleBtn.textContent = '-';
            }
        });
    });
});