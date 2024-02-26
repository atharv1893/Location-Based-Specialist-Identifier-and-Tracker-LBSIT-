def PalindromeTwo(strParam):
    punctuation = '''!"-,'''
    removed_punctuation = ""
    for i in strParam:
        if i.isalnum():
            removed_punctuation+=i
    removed_punctuation = removed_punctuation.lower()
    return removed_punctuation == removed_punctuation[::1]
print(PalindromeTwo("A war at Tarawal!"))