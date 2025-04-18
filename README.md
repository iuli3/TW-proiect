# Proiect-TW



**Eventix** este o platforma moderna de gestionare a evenimentelor si vanzare a biletelor. Utilizatorii pot cauta evenimente, adauga la favorite, cumpara bilete si lasa recenzii organizatorilor. Organizatorii pot adauga evenimente, vizualiza statistici si gestiona comenzile, iar administratorii au acces la un dashboard complet de management.

---

## Tehnologii utilizate

- **Frontend**: React, React Bootstrap, Axios, FontAwesome  
- **Backend**: Node.js, Express  
- **Baza de date**: MongoDB (local sau MongoDB Atlas)  
- **Autentificare**: JWT (JSON Web Token)

---

## Pasi pentru rularea proiectului local

```bash
# Instaleaza dependintele
## Backend
cd backend
npm install

## Frontend
cd ../frontend
npm install
```

```bash
# Porneste serverul backend
cd backend
npm start
```

```bash
# Porneste frontend-ul
cd frontend
npm start
```

---

## Credentiale test

- **User**: `iulii` &nbsp;&nbsp;&nbsp;&nbsp;| Parola: `iuli`  
- **Organizator**: `BerariaH` &nbsp;&nbsp;&nbsp;&nbsp;| Parola: `berariah`  
- **Admin**: `admin` &nbsp;&nbsp;&nbsp;&nbsp;| Parola: `admin`

---

## Structura si functionalitati aplicatie

### 🔹 Pagina principala
- Carusel cu evenimente recomandate
- Carusel cu evenimente din saptamana curenta
- Cardurile duc la pagina cu detalii despre eveniment

### 🔹 Pagina unui eveniment
- Afiseaza titlu, imagine, locatie, data, tipuri de bilete
- Utilizatorul poate:
  - Selecta bilete si adauga in cos
  - Cumpara bilete (daca este logat)
  - Adauga/elimina din favorite

### 🔹 Pagina autentificare / inregistrare
- Logare in cont sau creare cont nou
- Dupa logare, se salveaza token-ul JWT
- Se afiseaza numele si rolul utilizatorului

### 🔹 Cosul de bilete
- Accesibil din header
- Afiseaza biletele adaugate
- Permite modificarea cantitatii sau eliminarea
- Redirectionare catre pagina de checkout

### 🔹 Pagina de checkout
- Formular pentru simularea platii
- Dupa trimitere:
  - Se salveaza comanda
  - Redirectionare catre pagina „Biletele mele”

### 🔹 Pagina biletele mele
- Lista cu comenzile efectuate
- Fiecare comanda include cod QR si detalii
- Disponibila doar pentru utilizatori autentificati

### 🔹 Pagina favorite
- Afiseaza evenimentele marcate ca favorite
- Utilizatorul poate elimina evenimentele din lista

### 🔹 Pagina toate evenimentele
- Lista completa a evenimentelor disponibile
- Functionalitati:
  - Cautare in timp real
  - Filtrare dupa oras si categorie
  - Paginare

### 🔹 Pagina organizatori
- Afiseaza toti organizatorii din platforma
- Cautare dupa nume
- Fiecare card duce la pagina cu evenimentele acelui organizator

### 🔹 Pagina cerere organizator
- Formular pentru utilizatorii care doresc sa devina organizatori
- Campuri: nume firma, email, telefon, detalii
- Cererea este trimisa administratorului pentru aprobare

### 🔹 Pagina evenimentele mele (organizator)
- Afiseaza lista evenimentelor create
- Butoane de editare si stergere

### 🔹 Dashboard organizator
- Vizualizeaza:
  - Bilete vandute
  - Venituri generate
  - Rating mediu de la recenzii
- Afiseaza grafice si statistici in timp real

### 🔹 Profil utilizator
- Afiseaza datele personale si lista comenzilor
- Functionalitati:
  - Editare date (nume, email, poza)
  - Schimbare parola
  - Logout

### 🔹 Dashboard administrator
- Functionalitati:
  - Aprobare / respingere cereri de organizator
  - Lista utilizatori (modificare rol, stergere)
  - Statistici globale: bilete, venituri, evenimente active
- Include grafice si date centralizate

---

