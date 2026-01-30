const API = "https://api.artic.edu/api/v1/artworks";

async function getArtworks() {
  try {
    const response = await fetch(API);
    const artData = await response.json();

    const table = $("#artworkTable").DataTable({
      data: artData.data,
      columns: [
        { data: "title", defaultContent: "Untitled" },
        { data: "artist_title", defaultContent: "Unknown artist" },
        { data: "date_display", defaultContent: "Unknown" },
      ],
      language: {
        lengthMenu: "Artworks per page:&nbsp;_MENU_",
      },
      initComplete: function () {
        $("#artworksLoading").hide();
        $("#artworkTable_wrapper").show();
      },
    });

    $("#artworkTable tbody").on("click", "tr", function () {
      const rowData = table.row(this).data();
      const artworkId = rowData.id;

      getArtworkDetails(artworkId);
    });
  } catch (error) {
    console.log("error with getArtworks: ", error);
  }
}

async function getArtworkDetails(id) {
  try {
    const response = await fetch(`${API}/${id}`);
    const artDetails = await response.json();

    const imageUrl = `https://www.artic.edu/iiif/2/${artDetails.data.image_id}/full/843,/0/default.jpg`;
    const title = artDetails.data.title ?? "Untitled";
    const artist = artDetails.data.artist_display ?? "Unknown Artist";
    const date = artDetails.data.date_display ?? "Unknown";
    const origin = artDetails.data.place_of_origin ?? "Unknown";
    const medium = artDetails.data.medium_display ?? "N/A";
    const dimensions = artDetails.data.dimensions ?? "N/A";
    const description = artDetails.data.description ?? "No Description";

    $("#artImage").attr("src", imageUrl);
    $("#artTitle").text(title);
    $("#artArtist").text(artist);
    $("#artDate").text(date);
    $("#artOrigin").text(origin);
    $("#artMedium").text(medium);
    $("#artDimensions").text(dimensions);
    $("#artDesc").html(description);

    $("#artModal").modal("show");
  } catch (error) {
    console.log("error with getArtworkDetails: ", error);
  }
}

$(document).ready(function () {
  getArtworks();
});
