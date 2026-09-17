window.Itinerary = {
  state: { days: [] },
  init: () => {
    const saved = localStorage.getItem('tv_itinerary');
    if (saved) { window.Itinerary.state = JSON.parse(saved); } 
    else { window.Itinerary.state = { days: [{ title: 'Day 1', activities: [] }] }; }
    window.Itinerary.setupDragDrop();
  },
  save: () => {
    localStorage.setItem('tv_itinerary', JSON.stringify(window.Itinerary.state));
    window.Itinerary.render();
  },
  addDay: () => {
    window.Itinerary.state.days.push({ title: `Day ${window.Itinerary.state.days.length + 1}`, activities: [] });
    window.Itinerary.save();
  },
  removeDay: (dayIndex) => {
    if(confirm('Remove this day?')) {
      window.Itinerary.state.days.splice(dayIndex, 1);
      window.Itinerary.save();
    }
  },
  addActivity: (dayIndex, activity) => {
    if(!window.Itinerary.state.days[dayIndex]) return;
    window.Itinerary.state.days[dayIndex].activities.push({ id: window.Utils.generateId(), ...activity });
    window.Itinerary.save();
  },
  removeActivity: (dayIndex, activityIndex) => {
    window.Itinerary.state.days[dayIndex].activities.splice(activityIndex, 1);
    window.Itinerary.save();
  },
  moveActivity: (fromDay, fromIndex, toDay, toIndex) => {
    const act = window.Itinerary.state.days[fromDay].activities.splice(fromIndex, 1)[0];
    window.Itinerary.state.days[toDay].activities.splice(toIndex, 0, act);
    window.Itinerary.save();
  },
  render: () => {
    const container = document.getElementById('itinerary-container');
    if (!container) return;
    container.innerHTML = window.Itinerary.state.days.map((day, dIdx) => window.Itinerary.renderDay(day, dIdx)).join('');
    window.Itinerary.setupDragDrop();
  },
  renderDay: (day, index) => `
    <div class="itinerary-day" data-day="${index}">
      <div class="day-header">
        <h3>${day.title}</h3>
        <button class="btn btn-sm btn-outline" onclick="window.Itinerary.removeDay(${index})">X</button>
      </div>
      <div class="day-activities" ondragover="event.preventDefault(); this.style.backgroundColor='#f0f4f8';" ondragleave="this.style.backgroundColor='';" ondrop="window.Itinerary.handleDrop(event, ${index})">
        ${day.activities.length ? day.activities.map((act, aIdx) => window.Itinerary.renderActivity(act, index, aIdx)).join('') : '<div class="empty-drop">Drop activities here</div>'}
      </div>
    </div>
  `,
  renderActivity: (act, dIdx, aIdx) => `
    <div class="activity-card" draggable="true" ondragstart="event.dataTransfer.setData('text/plain', JSON.stringify({dIdx:${dIdx}, aIdx:${aIdx}}))">
      <h4>${act.title}</h4>
      <p>${act.description || ''}</p>
      <button class="btn btn-sm btn-ghost" onclick="window.Itinerary.removeActivity(${dIdx}, ${aIdx})">Remove</button>
    </div>
  `,
  handleDrop: (event, toDay) => {
    event.preventDefault();
    event.currentTarget.style.backgroundColor='';
    try {
      const data = JSON.parse(event.dataTransfer.getData('text/plain'));
      window.Itinerary.moveActivity(data.dIdx, data.aIdx, toDay, window.Itinerary.state.days[toDay].activities.length);
    } catch(e){}
  },
  setupDragDrop: () => {},
  exportHTML: () => {
    const printWin = window.open('', '_blank');
    printWin.document.write(`<html><head><title>My Itinerary</title><style>body{font-family:sans-serif;} .day{margin-bottom:20px;} .activity{border:1px solid #ccc; padding:10px; margin-bottom:5px;}</style></head><body><h2>My Travel Itinerary</h2>`);
    window.Itinerary.state.days.forEach(day => {
      printWin.document.write(`<div class="day"><h3>${day.title}</h3>`);
      day.activities.forEach(act => printWin.document.write(`<div class="activity"><strong>${act.title}</strong><br>${act.description||''}</div>`));
      printWin.document.write(`</div>`);
    });
    printWin.document.write('</body></html>');
    printWin.document.close();
    setTimeout(() => printWin.print(), 500);
  },
  clearAll: () => {
    if(confirm('Clear entire itinerary?')) {
      window.Itinerary.state = { days: [{ title: 'Day 1', activities: [] }] };
      window.Itinerary.save();
    }
  }
};
