def smallest(pattern):
    result = []
    stack = []
    num = 1

    for ch in pattern:
        stack.append(num)
        num += 1

        if ch == 'N':
            while stack:
                result.append(stack.pop())

    stack.append(num)
    while stack:
        result.append(stack.pop())

    return ''.join(map(str, result))


print(smallest("MNM"))