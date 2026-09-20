;; SFHT Syntax Highlighting for Zed

;; Directives
(
  (directive) @keyword
  (#match? @keyword "^@(if|elseif|else|endif|foreach|endforeach|for|endfor|while|endwhile|extends|block|endblock|include|includeWhen|component|endcomponent|use|empty|endempty)\\b")
)

;; Comments
(comment) @comment

;; Strings
(string) @string

;; Variables
(variable) @variable

;; Filters
(filter) @function

;; Operators
(
  (operator) @operator
  (#match? @operator "==|!=|<=|>=|<|>|===|!==|&&|\\|\\||!|\\+|-|\\*|/|%")
)

;; Numbers
(number) @number

;; Keywords
(keyword) @keyword
