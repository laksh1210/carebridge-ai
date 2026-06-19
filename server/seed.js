import db from './db.js';

const barriersInfo = [
  { icon: "/fear.png", name: "Fear of diagnosis", desc: "Worrying that confirming a problem makes it worse. Early detection consistently leads to better outcomes." },
  { icon: "/stigma.png", name: "Social stigma", desc: "Fear of judgment from family or community, especially for mental health or reproductive issues." },
  { icon: "/masculinity.png", name: "Masculinity norms", desc: "\"Be strong, it'll pass.\" Men are 40% less likely to seek care early. Vulnerability is strength." },
  { icon: "/cost.png", name: "Cost concerns", desc: "Most basic consultations cost ₹200 to ₹500. PMJAY covers ₹5 lakh per family. Help is affordable." },
  { icon: "/time.png", name: "Lack of time", desc: "Telemedicine appointments take 15 minutes. You don't have to leave work." },
  { icon: "/denial.png", name: "Denial", desc: '"It will go away." Sometimes it does, but knowing when to check is what CareBridge helps with.' },
];

const storiesInfo = [
  { name: "Rahul, 42", quote: "I kept ignoring the chest pain because I thought a hospital visit would bankrupt us. CareBridge showed me which local government hospital to visit for a free checkup. It saved my life.", tag: "Cost concern overcome", category: "Cost", tagBg: "var(--brand-lt)", tagColor: "var(--brand-dk)", outcome: "Received free care" },
  { name: "Priya, 28", quote: "In my community, going to therapy is seen as a weakness. I was terrified. Taking the first step anonymously on my phone made all the difference.", tag: "Stigma broken", category: "Stigma", tagBg: "var(--purple-lt)", tagColor: "var(--purple)", outcome: "Found a therapist" },
  { name: "Amit, 35", quote: "I told myself I didn't have time. I work 10 hour shifts. But learning I could do a 15-minute video consult during my break? That changed everything.", tag: "Time found", category: "Time", tagBg: "var(--amber-lt)", tagColor: "var(--amber)", outcome: "Completed eSanjeevani call" },
  { name: "Sneha, 51", quote: "I was convinced the lump meant the worst. I paralyzed myself with fear for months. When I finally used the AI chat, it gently guided me to a clinic where they found it was completely benign.", tag: "Fear conquered", category: "Fear", tagBg: "var(--blue-lt)", tagColor: "var(--blue)", outcome: "Benign diagnosis" },
  { name: "Vikram, 39", quote: "I live 40km from the nearest major hospital. Taking a whole day off to travel wasn't an option. Setting up a tele-consultation meant I didn't have to choose between my health and my job.", tag: "Distance bridged", category: "Distance", tagBg: "var(--green-lt)", tagColor: "var(--green)", outcome: "Remote consultation" },
  { name: "Anjali, 45", quote: "I kept telling my family 'it's just a cough, it will go away'. Denial is powerful. CareBridge helped me realize that getting checked is actually how I protect my family.", tag: "Denial overcome", category: "Denial", tagBg: "var(--red-lt)", tagColor: "var(--red)", outcome: "Started treatment" }
];

const insertStmt = db.prepare(`
  INSERT INTO content (key, value)
  VALUES (@key, @value)
  ON CONFLICT(key) DO UPDATE SET value = excluded.value
`);

const seed = db.transaction(() => {
  insertStmt.run({ key: 'barriers', value: JSON.stringify(barriersInfo) });
  insertStmt.run({ key: 'stories', value: JSON.stringify(storiesInfo) });
});

seed();
console.log('Database seeded successfully.');
