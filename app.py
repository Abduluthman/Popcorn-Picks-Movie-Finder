from flask import Flask, render_template, request, jsonify, redirect, url_for
import requests

app = Flask(__name__)
app.secret_key = 'SecretPasswordHere123' 
OMDB_API_KEY = ''  # Replace with your real OMDb key
search_history = []

DEFAULT_POSTER = "https://via.placeholder.com/300x445?text=No+Image"

# Classifying rating for badge color
def get_rating_class(rating):
    try:
        rating_val = float(rating)
        if rating_val >= 7.0:
            return 'badge-green'
        elif rating_val >= 5.0:
            return 'badge-yellow'
        else:
            return 'badge-red'
    except:
        return 'badge-gray'

@app.route('/', methods=['GET', 'POST'])
def index():
    query = ''
    page = int(request.args.get('page', 1))
    results = []
    total_pages = 1
    error = None

    if request.method == 'POST':
        query = request.form['movie']
        return redirect(url_for('index', movie=query, page=1))

    if request.method == 'GET':
        query = request.args.get('movie', '')

    if query:
        if query not in search_history:
            search_history.insert(0, query)
            if len(search_history) > 10:
                search_history.pop()

        search_url = f"http://www.omdbapi.com/?apikey={OMDB_API_KEY}&s={query}&page={page}"
        response = requests.get(search_url)
        data = response.json()

        if data.get('Response') == 'True':
            total_results = int(data['totalResults'])
            total_pages = (total_results + 9) // 10

            for item in data['Search']:
                imdb_id = item.get('imdbID')
                detail_url = f"http://www.omdbapi.com/?apikey={OMDB_API_KEY}&i={imdb_id}"
                detail_response = requests.get(detail_url)
                detail_data = detail_response.json()

                title = detail_data.get('Title', 'Unknown Title')
                poster = detail_data.get('Poster', DEFAULT_POSTER)
                if poster == "N/A":
                    poster = DEFAULT_POSTER
                year = detail_data.get('Year', 'N/A')
                rating = detail_data.get('imdbRating', 'N/A')
                genres = detail_data.get('Genre', '').split(', ') if detail_data.get('Genre') else []

                results.append({
                    "title": title,
                    "poster": poster,
                    "year": year,
                    "rating": rating,
                    "imdb_id": imdb_id,
                    "rating_class": get_rating_class(rating),
                    "genres": genres
                })
        else:
            error = data.get('Error', 'Movie not found.')

    # Extracting unique genres for filter chips
    all_genres = set()
    for movie in results:
        all_genres.update(movie.get("genres", []))
    genre_list = sorted(all_genres)

    return render_template('index.html',
                           results=results,
                           query=query,
                           page=page,
                           total_pages=total_pages,
                           history=search_history,
                           error=error,
                           genre_list=genre_list)  # Pass genre list to template

@app.route('/autocomplete')
def autocomplete():
    query = request.args.get('q', '')
    if not query:
        return jsonify([])
    url = f"http://www.omdbapi.com/?apikey={OMDB_API_KEY}&s={query}"
    response = requests.get(url).json()
    titles = [movie['Title'] for movie in response.get("Search", [])]
    return jsonify(titles)

@app.route('/movie/<imdb_id>')
def movie_detail(imdb_id):
    url = f"http://www.omdbapi.com/?apikey={OMDB_API_KEY}&i={imdb_id}&plot=full"
    response = requests.get(url)
    return jsonify(response.json())

@app.route('/clear-history')
def clear_history():
    search_history.clear()
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
