const box = {
    margin: '10px auto',
    display: 'flex',
    flexFlow: 'row wrap'
}
const main = {
    width: '100%',
    height: '100%',
    display: 'grid',
   
}
const header = {
    gridColumnStart: 1,
    gridColumnEnd: 4,
    gridRowStart: 1,
    gridRowEnd: 3,
}
const navbar = {
    display: 'flex',
    justifyContent: 'space-between',
}
const navLinks = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
}


export const style = {
    box: box,
    main: main,
    header: header
}
