#Fun With Scrollbars

I wanted to understand how Google created and used their scrollbars in apps like Gmail.

This experiment is a result of replicating that behavior and style with just CSS. It achieves the following:

- Styles the scrollbars using -webkit-scrollbar
- Is simply ignored in browsers that don't support it. (graceful fallback)
- In some cases, they use a scrollbar that's visible on hover only. This is controlled by a class, which can be applied by javascript.

##Why change the scrollbars?

The reason why I started looking into it was due to MacOSX and some mobile browsers hiding scrollbars when they're not in use. Sometimes, this makes it so a person can't tell there's additional content.
