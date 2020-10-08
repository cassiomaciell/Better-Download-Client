;(function () {
	const BetterDownloads = require("better-downloads")
	const {ipcRenderer} = require('electron');
	document.querySelectorAll("img").forEach((e) => {
		e.ondragstart = function () {
			return false
		}
	})
	document.querySelector(".title-bar-button#btn-minimize").addEventListener("click", (e) => {
        ipcRenderer.send('minimize-app')
    })
	document.querySelector(".title-bar-button#btn-close").addEventListener("click", (e) => {
        ipcRenderer.send('close-app')
	})
	document.querySelector("#download-button").addEventListener("click", (e) => {
		const url = document.querySelector("#url-input").value
		const fileName = document.querySelector("#file-name-input").value || "output"
		const outputDir = document.querySelector("#output-dir-input").value || "downloads"
		const threads = Number.parseInt(Number.parseInt(document.querySelector("#threads-input").value).toFixed(0))

		if (!url) return document.querySelector("#url-input").focus()
		if (!threads || threads < 1) return document.querySelector("#threads-input").focus()

		if (url && threads) {
			startDownload(url, threads, fileName, outputDir)
		}
	})
	let downloading = false
	/**
	 * @type {BetterDownloads}
	 */
	let currentDownload
	let fileSize = 0
	let downloaded = 0
	const bell = new Audio("sounds/bell.mp3")
	const error = new Audio("sounds/error.mp3")
	const progressBar = document.getElementById("progress")
	function setProgress(progress) {
		if (progress <= 100) {
			progressBar.style.width = `${progress.toFixed(0)}%`
			progressBar.innerText = `${progress.toFixed(0)}%`
			return true
		} else {
			return false
		}
	}
	function startDownload(url, threads, fileName, outPutdir) {
		if (downloading) return
		setProgress(0)
		downloaded = 0
		currentDownload = null
		document.querySelector("#download-button").disabled = true
		console.log(url, threads)
		currentDownload = new BetterDownloads({ host: url, threads: threads, fileName: fileName, outputDir: outPutdir })
		currentDownload.once("start", (fls) => {
			fileSize = fls
			downloading = true
		})
		currentDownload.on("data-download", (chunk) => {
			downloaded += chunk.length
			updateProgress()
		})
		currentDownload.once("end", () => {
			currentDownload = false
			downloading = false
			bell.currentTime = 0
			bell.play()
		})
		currentDownload.on("error", () => {
			currentDownload = false
			downloading = false
			error.currentTime = 0
			error.play()
		})
		currentDownload.start()
	}
	function updateProgress() {
		setProgress((downloaded / fileSize) * 100)
	}
})()
