document.addEventListener('DOMContentLoaded', () => {
  if(window.Itinerary) {
    window.Itinerary.init();
    window.Itinerary.render();
  }
  renderActivityPicker();
});

function renderActivityPicker() {
  const container = document.getElementById('activityPicker');
  if (!container) return;
  
  // mock activities to pick from
  const activities = [
    { title: 'City Tour', description: 'Guided tour of the main attractions' },
    { title: 'Museum Visit', description: 'Entry to local historical museum' },
    { title: 'Dinner Cruise', description: 'Evening cruise with 3-course meal' },
    { title: 'Hiking', description: 'Half-day hike in the nearby trails' },
    { title: 'Beach Day', description: 'Relaxing day at the local beach' }
  ];
  
  container.innerHTML = activities.map((act, i) => `
    <div class="activity-card template" draggable="true" ondragstart="event.dataTransfer.setData('text/plain', JSON.stringify({ isNew: true, ...${JSON.stringify(act).replace(/"/g, '&quot;')} }))">
      <h4>${act.title}</h4>
      <p>${act.description}</p>
    </div>
  `).join('');
  
  // Override handleDrop in Itinerary to support new items
  const origDrop = window.Itinerary.handleDrop;
  window.Itinerary.handleDrop = (event, toDay) => {
    event.preventDefault();
    event.currentTarget.style.backgroundColor='';
    try {
      const data = JSON.parse(event.dataTransfer.getData('text/plain'));
      if (data.isNew) {
        delete data.isNew;
        window.Itinerary.addActivity(toDay, data);
      } else {
        window.Itinerary.moveActivity(data.dIdx, data.aIdx, toDay, window.Itinerary.state.days[toDay].activities.length);
      }
    } catch(e){}
  };
}
