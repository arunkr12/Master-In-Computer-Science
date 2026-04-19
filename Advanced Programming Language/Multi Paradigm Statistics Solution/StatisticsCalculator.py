class StatisticsCalculator:
    def __init__(self, data):
        self.data = data

    def calculate_mean(self):
        return sum(self.data) / len(self.data)

    def calculate_median(self):
        sorted_data = sorted(self.data)
        n = len(sorted_data)
        mid = n // 2
        if n % 2 == 0:
            return (sorted_data[mid - 1] + sorted_data[mid]) / 2
        return sorted_data[mid]

    def calculate_mode(self):
        from collections import Counter
        counts = Counter(self.data)
        max_freq = max(counts.values())
        return [val for val, freq in counts.items() if freq == max_freq]

    def display_results(self):
        print("--- Python OOP Statistics ---")
        print(f"Input Data: {self.data}")
        print(f"Mean: {self.calculate_mean():.2f}")
        print(f"Median: {self.calculate_median():.2f}")
        print(f"Mode(s): {self.calculate_mode()}")

if __name__ == "__main__":
    calc = StatisticsCalculator([12, 5, 8, 12, 5, 10, 15])
    calc.display_results()
