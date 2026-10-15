import os
from flask import Flask, render_template, send_from_directory, request, jsonify, redirect

app = Flask(__name__)

# Pfad zum Foto-Ordner
PHOTOS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fotos für website')


@app.route('/')
def index():
    """Hauptseite – Nexum Weddings One-Pager"""
    return render_template('index.html')


@app.route('/portfolio')
def portfolio():
    """Redirect auf One-Pager Portfolio-Bereich"""
    return redirect('/#portfolio')


@app.route('/ueber-uns')
def ueber_uns():
    """Redirect auf One-Pager Startseite"""
    return redirect('/#hero')


@app.route('/leistungen')
def leistungen():
    """Redirect auf One-Pager Leistungen-Bereich"""
    return redirect('/#leistungen')


@app.route('/kontakt')
def kontakt():
    """Redirect auf One-Pager Kontakt-Bereich"""
    return redirect('/#kontakt')


@app.route('/api/kontakt', methods=['POST'])
def kontakt_submit():
    """Kontaktformular API-Endpunkt"""
    data = request.get_json()
    name = data.get('name', '')
    email = data.get('email', '')
    datum = data.get('datum', '')
    nachricht = data.get('nachricht', '')
    
    # Hier könnte man E-Mail-Versand oder DB-Speicherung einbauen
    print(f"Neue Anfrage: {name} ({email}) – Datum: {datum}")
    print(f"Nachricht: {nachricht}")
    
    return jsonify({'success': True, 'message': 'Vielen Dank für Ihre Anfrage! Wir melden uns in Kürze bei Ihnen.'})


@app.route('/fotos/<path:filename>')
def serve_photo(filename):
    """Liefert Fotos aus dem Foto-Ordner"""
    return send_from_directory(PHOTOS_DIR, filename)


@app.route('/api/fotos')
def get_photos():
    """API-Endpunkt: Liste aller verfügbaren Fotos"""
    photos = []
    if os.path.exists(PHOTOS_DIR):
        for f in sorted(os.listdir(PHOTOS_DIR)):
            if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
                photos.append({
                    'filename': f,
                    'url': f'/fotos/{f}'
                })
    return jsonify(photos)


if __name__ == '__main__':
    app.run(debug=True, port=5001)
