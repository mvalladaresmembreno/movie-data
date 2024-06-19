$(document).ready(function() {

    $('#movieInput').autocomplete({
        source: function(request, response) {
            $.ajax({
                url: '/autocomplete',
                data: { q: request.term },
                success: function(data) {
                    response(data);
                }
            });
        },
        minLength: 2, 
    });
    
    $('#recommendBtn').click(function() {
        let movieName = $('#movieInput').val();
        if (!movieName) {
            $('#error-message').text('Ingrese el nombre de la pelicula');
            return;
        }
        $.ajax({
            type: 'POST',
            url: '/recommend',
            data: { movie: movieName },
            success: function(response) {
                let recommendations = $('#recommendations');
                let errorMessage = $('#error-message');
                recommendations.empty();
                errorMessage.text('');
                if (response.error) {
                    errorMessage.text(response.error);
                } else {
                    response.movies.forEach((movie, index) => {
                        let shortText = response.overview[index].substring(0, 100);
                        let remainingText = response.overview[index].substring(100);
                        let movieCard = `
                            <div class="col-md-3 col-sm-1 mb-3">
                                <div class="card border-light  h-100">
                                    <img src="${response.posters[index]}" class="card-img-top" alt="${movie}">
                                    <div class="card-body p-0">
                                        <h5 class="card-title">${movie}</h5>
                                        <p class="card-text text-justify">${shortText}<span class="dots">...</span><span class="moreText collapse" id="collapseOverview${index}">${remainingText}</span></p>
                                        <button class="btn btn-dark btn-bg moreLessButton" data-toggle="collapse" href="#collapseOverview${index}" aria-expanded="false" aria-controls="collapseOverview${index}">Leer más</button>
                                    </div>
                                </div>
                            </div>`;
                        recommendations.append(movieCard);
                    });

                    // agrega el event listeners para los botones
                    $('.moreLessButton').on('click', function () {
                        let $this = $(this);
                        let text = $this.text();
                        $this.text(text === "Leer más" ? "Leer menos" : "Leer más");
                    });
                }
            }
        });
    });
});
