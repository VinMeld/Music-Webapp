export const generateTagsList = (songs) => {
    // This generates the tag list which is loaded in the drop down menu in displayFilters.
    let tagsList = []
    if(songs){
        //remove duplicates from tagsList
        if(songs.length > 0){
            songs.forEach(song => {
                song.tags.forEach(tag => {
                    if(!tagsList.includes(tag)){
                        tagsList.push(tag);
                    }
                })
            })
            return tagsList;
        }
    }
    return [];
}