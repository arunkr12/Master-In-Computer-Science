def add_two_distinct_values(val1, val2):
    print(f"Attempting to add {type(val1)} and {type(val2)}")
    try:
        # This will raise a TypeError
        result = val1 + val2
        print(f"Result: {result}")
    except TypeError as e:
        print(f"Error: {e}")

# Main execution
num = 100
text = "200"
add_two_distinct_values(num, text)
