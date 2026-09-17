// itinerary.js
const ACTIVITIES = [
  { id: 'a1', name: 'Eiffel Tower Tour', emoji: '🗼', category: 'sightseeing', duration: '2h' },
  { id: 'a2', name: 'Louvre Museum', emoji: '🖼️', category: 'sightseeing', duration: '4h' },
  { id: 'a3', name: 'Seine River Cruise', emoji: '🚤', category: 'sightseeing', duration: '1.5h' },
  { id: 'a4', name: 'Pasta Making Class', emoji: '🍝', category: 'food', duration: '3h' },
  { id: 'a5', name: 'Street Food Tour', emoji: '🌮', category: 'food', duration: '2.5h' },
  { id: 'a6', name: 'Wine Tasting', emoji: '🍷', category: 'food', duration: '2h' },
  { id: 'a7', name: 'Scuba Diving', emoji: '🤿', category: 'adventure', duration: '4h' },
  { id: 'a8', name: 'Mountain Hiking', emoji: '🧗', category: 'adventure', duration: '5h' },
  { id: 'a9', name: 'Zip Lining', emoji: '⚡', category: 'adventure', duration: '2h' },
  { id: 'a10', name: 'Relax at Beach', emoji: '🏖️', category: 'beach', duration: 'Flexible' },
  { id: 'a11', name: 'Snorkeling', emoji: '🐠', category: 'beach', duration: '2h' },
  { id: 'a12', name: 'Local Market', emoji: '🛍️', category: 'shopping', duration: '2h' },
  { id: 'a13', name: 'Mall Shopping', emoji: '🏬', category: 'shopping', duration: '3h' },
  { id: 'a14', name: 'Clubbing', emoji: '🪩', category: 'nightlife', duration: 'Late' },
  { id: 'a15', name: 'Rooftop Bar', emoji: '🍸', category: 'nightlife', duration: '2h' }
];

let itinerary = {
  tripName: '',
  days: []
};

document.addEventListener('DOMContentLoaded', () => {
  loadItinerary();
  renderActivityPicker(ACTIVITIES);
  
  // Filtering activities
  document.querySelectorAll('.activity-categories .pill').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.activity-categories .pill').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const cat = e.target.dataset.actcat;
      if (cat === 'all') renderActivityPicker(ACTIVITIES);
      else renderActivityPicker(ACTIVITIES.filter(a => a.category === cat));
    });
  });
  
  document.getElementById('activitySearch').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const cat = document.querySelector('.activity-categories .pill.active').dataset.actcat;
    let filtered = ACTIVITIES.filter(a => a.name.toLowerCase().includes(q));
    if (cat !== 'all') filtered = filtered.filter(a => a.category === cat);
    renderActivityPicker(filtered);
  });

  document.getElementById('addDayBtn').addEventListener('click', () => {
    itinerary.days.push({ id: Date.now().toString(), items: [] });
    saveAndRender();
  });

  document.getElementById('clearItinerary').addEventListener('click', () => {
    if(confirm('Clear entire itinerary?')) {
      itinerary.days = [];
      saveAndRender();
    }
  });
  
  document.getElementById('tripName').addEventListener('change', (e) => {
    itinerary.tripName = e.target.value;
    saveItinerary();
  });
  
  document.getElementById('exportItinerary').addEventListener('click', () => {
    alert("Itinerary ready for export! (In a real app, this would download a PDF or send an email)");
  });
});

function loadItinerary() {
  const saved = localStorage.getItem('tv_itinerary');
  if (saved) {
    itinerary = JSON.parse(saved);
    document.getElementById('tripName').value = itinerary.tripName || '';
  }
  renderDays();
}

function saveItinerary() {
  localStorage.setItem('tv_itinerary', JSON.stringify(itinerary));
}

function saveAndRender() {
  saveItinerary();
  renderDays();
}

function renderActivityPicker(list) {
  const container = document.getElementById('activityList');
  container.innerHTML = '';
  
  list.forEach(act => {
    const el = document.createElement('div');
    el.className = 'activity-card';
    el.draggable = true;
    el.dataset.id = act.id;
    
    // Set up drag events
    el.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', JSON.stringify(act));
    });
    
    el.innerHTML = `
      <div class="activity-emoji">${act.emoji}</div>
      <div class="activity-details">
        <h5>${act.name}</h5>
        <span>${act.duration}</span>
      </div>
      <button class="activity-add-btn" title="Drag or click to add" onclick="quickAdd('${act.id}')">+</button>
    `;
    container.appendChild(el);
  });
}

window.quickAdd = (id) => {
  if (itinerary.days.length === 0) {
    alert("Please add a Day first!");
    return;
  }
  const act = ACTIVITIES.find(a => a.id === id);
  itinerary.days[0].items.push({...act, instanceId: Date.now().toString()});
  saveAndRender();
};

window.addCustomActivity = () => {
  const name = document.getElementById('customActivityName').value;
  const time = document.getElementById('customActivityTime').value;
  const dayId = document.getElementById('customActivityDay').value;
  
  if(!name || !dayId) {
    alert("Please enter a name and select a day.");
    return;
  }
  
  const dayIndex = itinerary.days.findIndex(d => d.id === dayId);
  if(dayIndex > -1) {
    itinerary.days[dayIndex].items.push({
      id: 'custom-' + Date.now(),
      instanceId: Date.now().toString(),
      name: name + (time ? ` (${time})` : ''),
      emoji: '📌',
      duration: 'Custom',
      category: 'custom'
    });
    
    document.getElementById('customActivityName').value = '';
    document.getElementById('customActivityTime').value = '';
    saveAndRender();
  }
};

function renderDays() {
  const container = document.getElementById('itineraryDays');
  const empty = document.getElementById('itineraryEmpty');
  const daySelect = document.getElementById('customActivityDay');
  
  // Clear day select options
  daySelect.innerHTML = '<option value="">Select day</option>';
  
  if (itinerary.days.length === 0) {
    container.innerHTML = '';
    container.appendChild(empty);
    empty.style.display = 'block';
    return;
  }
  
  empty.style.display = 'none';
  container.innerHTML = '';
  
  itinerary.days.forEach((day, index) => {
    // add to select
    const opt = document.createElement('option');
    opt.value = day.id;
    opt.textContent = `Day ${index + 1}`;
    daySelect.appendChild(opt);
    
    // build card
    const card = document.createElement('div');
    card.className = 'day-card';
    card.innerHTML = `
      <div class="day-header">
        <h3>Day ${index + 1}</h3>
        <button class="btn btn-ghost btn-sm" onclick="removeDay('${day.id}')" style="color:var(--danger)">Remove</button>
      </div>
      <div class="day-content" id="day-${day.id}" data-dayid="${day.id}">
        ${day.items.length === 0 ? '<p style="color:var(--text-muted); text-align:center; padding: 2rem 0;">Drag activities here or use + to add</p>' : ''}
      </div>
    `;
    
    container.appendChild(card);
    
    const content = card.querySelector('.day-content');
    
    // setup drop zone
    content.addEventListener('dragover', (e) => {
      e.preventDefault();
      content.classList.add('drag-over');
    });
    content.addEventListener('dragleave', () => {
      content.classList.remove('drag-over');
    });
    content.addEventListener('drop', (e) => {
      e.preventDefault();
      content.classList.remove('drag-over');
      try {
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        if (data.id) {
          day.items.push({...data, instanceId: Date.now().toString()});
          saveAndRender();
        }
      } catch(err) {}
    });
    
    // render items
    day.items.forEach((item, itemIdx) => {
      const el = document.createElement('div');
      el.className = 'itinerary-item';
      el.innerHTML = `
        <div class="drag-handle">☰</div>
        <div style="font-size:1.5rem; margin-right:1rem; background:var(--bg-card); width:40px; height:40px; display:flex; align-items:center; justify-content:center; border-radius:var(--radius-sm)">${item.emoji}</div>
        <div class="itinerary-item-info">
          <h4>${item.name}</h4>
          <p>${item.duration}</p>
        </div>
        <button class="btn-icon" onclick="removeItem('${day.id}', '${item.instanceId}')" style="color:var(--danger)">✕</button>
      `;
      content.appendChild(el);
    });
  });
}

window.removeDay = (id) => {
  itinerary.days = itinerary.days.filter(d => d.id !== id);
  saveAndRender();
};

window.removeItem = (dayId, instanceId) => {
  const day = itinerary.days.find(d => d.id === dayId);
  if (day) {
    day.items = day.items.filter(i => i.instanceId !== instanceId);
    saveAndRender();
  }
};
