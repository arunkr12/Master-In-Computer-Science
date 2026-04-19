#include <stdio.h>
#include <stdlib.h>

int compare(const void *a, const void *b) {
    return (*(int*)a - *(int*)b);
}

double get_mean(int arr[], int n) {
    double sum = 0;
    for (int i = 0; i < n; i++) sum += arr[i];
    return sum / n;
}

double get_median(int arr[], int n) {
    qsort(arr, n, sizeof(int), compare);
    if (n % 2 == 0)
        return (arr[n/2 - 1] + arr[n/2]) / 2.0;
    return arr[n/2];
}

void print_mode(int arr[], int n) {
    // Count frequencies in a sorted array
    int max_count = 0, current_count = 1;
    for (int i = 1; i < n; i++) {
        if (arr[i] == arr[i-1]) current_count++;
        else {
            if (current_count > max_count) max_count = current_count;
            current_count = 1;
        }
    }
    if (current_count > max_count) max_count = current_count;

    printf("Mode(s): ");
    current_count = 1;
    for (int i = 1; i < n; i++) {
        if (arr[i] == arr[i-1]) current_count++;
        else {
            if (current_count == max_count) printf("%d ", arr[i-1]);
            current_count = 1;
        }
    }
    if (current_count == max_count) printf("%d ", arr[n-1]);
    printf("\n");
}

int main() {
    int data[] = {12, 5, 8, 12, 5, 10, 15};
    int n = sizeof(data) / sizeof(data[0]);

    printf("--- C Procedural Statistics ---\n");
    printf("Input Data: ");
    for(int i=0; i<n; i++) printf("%d ", data[i]);
    
    printf("\nMean: %.2f\n", get_mean(data, n));
    printf("Median: %.2f\n", get_median(data, n));
    print_mode(data, n);
    
    return 0;
}
