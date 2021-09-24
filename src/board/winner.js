function chkLine(a,b,c,d) {
    // Check first cell non-zero and all cells match
    return ((a != 0) && (a ==b) && (a == c) && (a == d));
}

function chkWinner(bd) {
    // Check down
    for (let r = 0; r < 3; r++)
        for (let c = 0; c < 7; c++)
            if (chkLine(bd[c][r], bd[c][r+1], bd[c][r+2], bd[c][r+3]))
                return bd[c][r];

    // Check right
    for (let r = 0; r < 6; r++)
        for (let c = 0; c < 4; c++)
            if (chkLine(bd[c][r], bd[c+1][r], bd[c+2][r], bd[c+3][r]))
                return bd[c][r];

    // Check down-right
    for (let r = 0; r < 3; r++)
        for (let c = 0; c < 4; c++)
            if (chkLine(bd[c][r], bd[c+1][r+1], bd[c+2][r+2], bd[c+3][r+3]))
                return bd[c][r];

    // Check down-left
    for (let r = 3; r < 6; r++)
        for (let c = 0; c < 4; c++)
            if (chkLine(bd[c][r], bd[c+1][r-1], bd[c+2][r-2], bd[c+3][r-3]))
                return bd[c][r];

    return 0;
}

export default chkWinner;