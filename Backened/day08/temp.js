

const str = `
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    if (n == 0) {
        cout << -1;
        return 0;
    }

    int maxi = -1;
    for (int i = 0; i < n; i++) {
        int val;
        cin >> val;
        if (val > maxi) maxi = val;
    }

    cout << maxi;
    return 0;
}`;



console.log(JSON.stringify(str));
